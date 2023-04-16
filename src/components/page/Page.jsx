import { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { app } from "../../firebase/FirebaseSetup";
import axios from "axios";
import styles from "./Page.module.css";
import Spinner from "../spinner/Spinner";

const Page = () => {
  const [page, setPage] = useState("");

  useEffect(() => {
    const storage = getStorage(app, "gs://ml-docs-development.appspot.com");
    getDownloadURL(ref(storage, "lin-search.md"))
      .then((url) => {
        axios({
          url: url,
          method: "GET",
          responseType: "text",
        })
          .then((response) => {
            setPage(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    page === ""?<Spinner/>:
    <ReactMarkdown className={styles.page}>{page}</ReactMarkdown>);
};

export default Page;

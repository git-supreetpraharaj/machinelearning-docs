import { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { storage } from "../../firebase/FirebaseSetup";
import { getDownloadURL, ref } from "firebase/storage";
import axios from "axios";
import styles from "./Page.module.css";
import Spinner from "../spinner/Spinner";
import { useParams } from "react-router-dom";

const Page = () => {
  const [page, setPage] = useState("");
  const { pageName } = useParams();

  useEffect(() => {
    getDownloadURL(ref(storage, `machine-learning/${pageName}`))
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

  return page === "" ? (
    <Spinner />
  ) : (
    <ReactMarkdown className={styles.page}>{page}</ReactMarkdown>
  );
};

export default Page;

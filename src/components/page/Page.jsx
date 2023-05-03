import { useEffect, useState, useRef } from 'react';
import { storage } from '../../firebase/firebaseSetup';
import { ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';
import styles from './Page.module.css';
import Spinner from '../spinner/Spinner';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageHeader from './PageHeader';
import { Col, Container, Row } from 'react-bootstrap';
import { addPlaceholder } from '../../utils/utilities';
import DOMPurify from 'dompurify';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Page = () => {
    const [markdown, setMarkdown] = useState('');
    const [searchParams] = useSearchParams();
    const [editable, setEditable] = useState(
        searchParams.get('view') === 'edit'
    );
    const { bookId, pageId } = useParams();
    const { user, pageData } = useSelector((state) => {
        const user = state.auth.user;
        const pages = state.pages.pages;
        const pageD = pages.find((page) => page.id === pageId);
        return { user: user, pageData: pageD };
    });
    const [isSaving, setIsSaving] = useState(false);
    const editorRef = useRef(null);
    const previewRef = useRef(null);

    const handleButtonsClick = (type) => {
        if (!editorRef.current) {
            return;
        }
        const textarea = editorRef.current;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;

        const newMarkdown = addPlaceholder(type, markdown, startPos, endPos);
        setMarkdown(newMarkdown);
    };

    const handleUpload = () => {
        setIsSaving(true);
        const fileRef = ref(storage, `${bookId}/${pageId}.md`);
        const metadata = { contentType: 'text/markdown' };
        const blob = new Blob([markdown], { type: 'text/markdown' });
        uploadBytes(fileRef, blob, metadata)
            .then(() => {
                console.log('updated successfully');
            })
            .catch((error) => {
                console.log('Error updating file in storage: ', error);
            });
    };

    const handleEditorScroll = () => {
        const editorElement = editorRef.current;
        const previewElement = previewRef.current;
        const scrollPercent =
            editorElement.scrollTop /
            (editorElement.scrollHeight - editorElement.clientHeight);
        const newScrollTop =
            scrollPercent *
            (previewElement.scrollHeight - previewElement.clientHeight);
        const scrollThreshold = 10;
        if (Math.abs(previewElement.scrollTop - newScrollTop) > scrollThreshold)
            previewElement.scrollTop = newScrollTop;
    };

    const handlePreviewScroll = () => {
        if (editorRef.current) {
            const editorElement = editorRef.current;
            const previewElement = previewRef.current;
            const scrollPercent =
                previewElement.scrollTop /
                (previewElement.scrollHeight - previewElement.clientHeight);
            const newScrollTop =
                scrollPercent *
                (editorElement.scrollHeight - editorElement.clientHeight);
            const scrollThreshold = 10;
            if (
                Math.abs(editorElement.scrollTop - newScrollTop) >
                scrollThreshold
            )
                editorElement.scrollTop = newScrollTop;
        }
    };

    function handleKeyDown(event) {
        if (event.key === 'Tab' && !event.ctrlKey) {
            event.preventDefault();
            // Insert two spaces at the current cursor position
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;
            setMarkdown(
                markdown.substring(0, start) + '\t' + markdown.substring(end)
            );
            // Move the cursor two spaces to the right
            event.target.setSelectionRange(start + 1, start + 1);
        }
    }

    useEffect(() => {
        if (pageData && pageData.mdUrl) {
            axios
                .get(pageData.mdUrl, { responseType: 'text' })
                .then((res) => {
                    console.log(res);
                    setMarkdown(res?.data.replaceAll('\r', ''));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [pageData]);

    return markdown === '' ? (
        <Spinner />
    ) : (
        <div className={styles.page}>
            <PageHeader
                user={user}
                isSaving={isSaving}
                editable={editable}
                title={pageData.name}
                setEditable={setEditable}
                handleButtonsClick={handleButtonsClick}
                handleUpload={handleUpload}
            />

            <div className={styles.content}>
                <Container className={styles.pageContainer} fluid>
                    <Row className={styles.pageRow}>
                        {editable ? (
                            <Col>
                                <textarea
                                    ref={editorRef}
                                    className={styles.editor}
                                    value={markdown}
                                    onChange={(e) => {
                                        setMarkdown(e.target.value);
                                    }}
                                    onScroll={handleEditorScroll}
                                    onKeyDown={handleKeyDown}
                                />
                            </Col>
                        ) : (
                            <></>
                        )}
                        <Col>
                            <div
                                ref={previewRef}
                                className={styles.previewContainer}
                                onScroll={handlePreviewScroll}>
                                <ReactMarkdown
                                    className={styles.preview}
                                    escapeHtml={false}
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    children={DOMPurify.sanitize(markdown)}
                                    components={{
                                        code({
                                            node,
                                            inline,
                                            className,
                                            children,
                                            ...props
                                        }) {
                                            const match = /language-(\w+)/.exec(
                                                className || ''
                                            );
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    {...props}
                                                    children={String(
                                                        children
                                                    ).replace(/\n$/, '')}
                                                    style={okaidia}
                                                    language={match[1]}
                                                    PreTag="div"
                                                />
                                            ) : (
                                                <code
                                                    {...props}
                                                    className={className}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Page;

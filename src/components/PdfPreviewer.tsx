import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const PDFPreviewer: React.FC<{ fileUrl: string | null }> = ({ fileUrl }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    if(fileUrl === null) {
        return <div>No file selected</div>
    }

    return (
        <div>
            <div>
                <Toolbar>
                    {(props) => {
                        const {
                            CurrentPageInput,
                            GoToNextPage,
                            GoToPreviousPage,
                            NumberOfPages,
                            ZoomIn,
                            ZoomOut,
                        } = props;
                        return (
                            <div
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <div style={{ padding: '0 2px' }}>
                                    <ZoomOut />
                                </div>
                                <div style={{ padding: '0 2px' }}>
                                    <ZoomIn />
                                </div>
                                <div style={{ padding: '0 2px' }}>
                                    <GoToPreviousPage />
                                </div>
                                <div style={{ padding: '0 2px' }}>
                                    <CurrentPageInput />
                                </div>
                                <div style={{ padding: '0 2px' }}>
                                    <GoToNextPage />
                                </div>
                                <div style={{ padding: '0 2px' }}>
                                    <NumberOfPages />
                                </div>
                            </div>
                        );
                    }}
                </Toolbar>
            </div>
            <div style={{ justifyContent:'center',  height: '100%' }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                    <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
                </Worker>
            </div>
            <div>
                Page {pageNumber} of {numPages}
            </div>
        </div>
    );
};

export default PDFPreviewer;

import SpineViewer from "../components/SpinePlayer/SpineViewer.tsx";

function SpineCanvasSection() {
    const jsonURL = "https://esotericsoftware.com/files/examples/4.2/spineboy/export/spineboy-pro.skel";
    const atlasURL = "https://esotericsoftware.com/files/examples/4.2/spineboy/export/spineboy-pma.atlas";
    // const jsonURL = "https://int-sp-static-content.s3.amazonaws.com/static/dragoncity/mobile/tool/chests/skeleton.skel";
    // const atlasURL = "https://int-sp-static-content.s3.amazonaws.com/static/dragoncity/mobile/tool/chests/atlas.atlas";

    return(
        <div>
            <h1>spine canvas</h1>
                <div className="viewer-section">
                    <SpineViewer
                        jsonUrl={jsonURL}
                        atlasUrl={atlasURL}
                    />
            </div>
            <div className="form-section">

            </div>

        </div>
    )
}

export default SpineCanvasSection;
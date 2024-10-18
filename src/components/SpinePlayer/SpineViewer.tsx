// @ts-ignore
import React, {useEffect, useRef, useState} from 'react';
import {SpinePlayer, Skeleton, AssetManager, TextureAtlasRegion, TextureAtlasPage, TextureAtlas} from "@esotericsoftware/spine-player";
import '../../styles/SpinePlayer.css'

function SpineViewer ({ jsonUrl, atlasUrl }) {
    const playerRef = useRef(null);
    const [imageAttachments, setImageAttachments] = useState([]);
    const [player, setPlayer] = useState<SpinePlayer>(null);
    const [skeleton, setSkeleton] = useState<Skeleton>(null);

    useEffect(() => {
        if(playerRef.current){
            if(player !== null) {
                player.dispose();
            }

            AssetManager.prototype.loadTextureAtlasForSingleImageUrl = function (imgUrl: string) {
                const atlasPath = imgUrl;
                if (this.assets[atlasPath]) return Promise.resolve(this.assets[atlasPath]);
                this.start(atlasPath);

                this.start(imgUrl);
                let image = new Image();
                image.crossOrigin = "anonymous";
                image.src = imgUrl;

                return new Promise((resolve) => {
                    image.onload = () => {
                        const region = new TextureAtlasRegion(new TextureAtlasPage(imgUrl), imgUrl);
                        region.u = region.v = 0;
                        region.u2 = region.v2 = 1;
                        region.page.width = region.width = region.originalWidth = image.width;
                        region.page.height = region.height = region.originalHeight = image.height;

                        const atlas = new TextureAtlas("");
                        atlas.pages.push(region.page);
                        atlas.regions.push(region);

                        // set the loaded texture into the page (and internally into all the regions)
                        region.page.setTexture(this.textureLoader(image));

                        this.success(() => {}, imgUrl, region.page.texture);
                        this.success(() => {}, atlasPath, atlas);

                        resolve(atlas);
                    };
                    image.onerror = () => this.error(() => {}, imgUrl, `Couldn't load image: ${imgUrl}`);
                });
            }

            updateSpinePlayer(jsonUrl, atlasUrl, spinePlayerStatesSetup);

            return() => {
                player?.dispose();
            }
        }
    }, []);

    useEffect(() => {
        if(skeleton === null) return;
        populateAttachments();
    }, [skeleton]);


    function populateAttachments(){
        const currentAttachments = [...imageAttachments];

        skeleton.slots.forEach(slot => {
            if(slot.attachment === null) return;

            const attachment = skeleton.getAttachmentByName(slot.data.name, slot.attachment.name);
            currentAttachments.push(attachment);
        });

        setImageAttachments(currentAttachments);
    }

    function updateSpinePlayer(skeleton: string, atlas: string, succesCallback?) {
        //@ts-ignore
        new SpinePlayer(playerRef.current, {
            skeleton: skeleton,
            atlas: atlas,
            success: succesCallback
        })
    }

    function spinePlayerStatesSetup(pl: SpinePlayer){
        setPlayer(pl);
        setSkeleton(pl.skeleton);
    }

    async function imageToAtlasRegion(attachment, imageURL) {
        const atlas = await player.assetManager?.loadTextureAtlasForSingleImageUrl(imageURL);
        updateAttachment(atlas.regions[0], attachment);
    }

    function updateAttachment(region, attachmentName) {
        if(skeleton === null) return;

        const slot = skeleton.slots.find(slot => slot.data.name == attachmentName);

        const attachment = slot?.attachment;

        if (attachment) {
            attachment.region = region;
            slot.attachment?.updateRegion();
        }
        else{
            alert("NO ATTACHMENT FOUND!");
        }
    }

    function generateInputFields(){
        return(
            <div style={{width: '100%'}}>
                <h2>Attachments</h2>
                <div style={{maxHeight: '50vh', overflow:'scroll'}}>
                    {
                        imageAttachments.map((item, index) => {
                            return(
                                <div>
                                    <h3>{item.name}</h3>
                                    <button id="attachmentInput" onClick={() => imageToAtlasRegion(item.name, '/logo192.png')}>Load Attachment</button>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }


    return (
        <div style={{padding: '3rem'}}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <div style={{width: '100%'}}>
                    <div ref={playerRef} style={{ width: '800px', height: '600px' }}></div>
                </div>
                {generateInputFields()}
            </div>
        </div>
    );
}

export default SpineViewer;
// @ts-ignore
import React, {useEffect, useRef, useState} from 'react';
import {SpinePlayer, Attachment, Skeleton} from "@esotericsoftware/spine-player";
import '../../styles/SpinePlayer.css'

function SpineViewer ({ jsonUrl, atlasUrl }) {
    const playerRef = useRef(null);
    const [imageAttachments, setImageAttachments] = useState([]);
    const attachments = [];
    const [player, setPlayer] = useState<SpinePlayer>(null);
    const [skeleton, setSkeleton] = useState<Skeleton>(null);

    useEffect(() => {
        if(playerRef.current){
            if(player !== null) {
                player.dispose();
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
        skeleton.slots.forEach(slot => {
            if(slot.attachment === null) return;

            const attachment = skeleton.getAttachmentByName(slot.data.name, slot.attachment.name);
            registerAttachment(attachment);
        })

        const newAttachments = [...imageAttachments];
        newAttachments.push(attachments);
        setImageAttachments(newAttachments);
        console.log("IMAGE ATTACHMENTS", imageAttachments + "\nNON-STATE ATTACHMENTS", attachments);
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

    function registerAttachment(attachment: Attachment){
        attachments.push(attachment);
    }

    return (
        <div ref={playerRef} style={{ width: '800px', height: '600px' }}></div>
    );
}

export default SpineViewer;
import {useState} from 'react'
import ThumbnailExtractor from 'react-thumbnail-extractor'

export default function useVideoThumbnail() {
    const [thumbnail, setThumbnail] = useState(null);
    // const onBeforeCapture = (event) => {
    //     console.log("before capture",event);
    // }
    const onStartCapture = (event) => {
        setThumbnail(null)
        console.log("onStartCapture ",event);
    }
    // const onUnsupportedVideo = (event) => {
    // console.log("onUnsupportedVideo ",event);
    // }

    // const onCapture = (event) => {
    // console.log("onCapture ",event);
    // // setState({
    // //     Thumbnail: event
    // // })
    // }

    // const onComplete = (event) => {
    // console.log("onComplete ",event);
    // }

    const onCompleteDetails = (event) => {
        let keysArray = Object.keys(event.thumbs);
        let lastIndex = keysArray[keysArray.length-1];
        if(+lastIndex === keysArray.length){
            console.log("event.thumbs[].url",event, lastIndex, +lastIndex === keysArray.length)
            setThumbnail(event.thumbs[lastIndex].url)
        }
    }
    const ThumbnailContainer = (uploadedFile) => {
        return <ThumbnailExtractor 
        // displayImages 
        maxWidth={300} 
        count={1}
        onCompleteDetails={onCompleteDetails} 
        // onComplete={onComplete} 
        // onCapture={onCapture} 
        // onUnsupportedVideo={onUnsupportedVideo} 
        // onBeforeCapture={onBeforeCapture} 
        onStartCapture={onStartCapture} 
        videoFile={uploadedFile} 
    />
    }
    return {
        thumbnail,
        ThumbnailContainer,
    }
}

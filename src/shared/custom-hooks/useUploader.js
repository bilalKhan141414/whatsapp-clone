export default function useUploader() {
  const uploadVideo = (file) => {
    const formData = new FormData();
    formData.append("video", file);

    const ENDPOINT =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_URL_LIVE
        : process.env.REACT_APP_URL;
    // return postRequest({
    //     url: `${ENDPOINT}api/upload/video`,
    //     data: formData,
    //     options: {
    //         headers: {
    //             'content-type' : 'multipart/form-data',
    //             mode: 'no-cors',
    //         }
    //     }
    // });
  };
  return {
    // progress,
    uploadVideo,
  };
}

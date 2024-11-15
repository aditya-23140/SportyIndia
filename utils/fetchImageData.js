const fetchImageData = async (athleteId, imageId,imageData,setImageData) => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    const loggedInUserId = loginInfo ? loginInfo.userId : null;

    try {
        const response = await fetch(`/api/images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageBuffer: imageId,
            }),
        });

        const data = await response.json();
        if (data.imageId) {
            setImageData((prevData) => ({
                ...prevData,
                [`${athleteId}_${imageId}`]: `/images/${data.imageId}.png`,
            }));
            if(loggedInUserId && athleteId===loggedInUserId) {
                localStorage.setItem("profilePic", data.imageId);
              }
        }
    } catch (error) {
        console.error('Error fetching image data:', error);
    }
};

export default fetchImageData;

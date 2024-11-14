const fetchImageData = async (athleteId, imageId,imageData,setImageData) => {
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
        }
    } catch (error) {
        console.error('Error fetching image data:', error);
    }
};

export default fetchImageData;

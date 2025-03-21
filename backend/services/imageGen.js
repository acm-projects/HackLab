const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const slugify = require('slugify');
const fs = require('fs');
const { uploadGenImageToS3 } = require('./s3Service');

dotenv.config();

async function imageGen (imagePrompt) {

	const API_KEY = process.env.GEMINI_API_KEY;

    const imageContext = "Create a thumbnail for a website/app that is called: ";
    const fullImagePrompt = `${imageContext} ${imagePrompt}`;
    console.log( "this is the imagePrompt: " + fullImagePrompt)
    let prompt = fullImagePrompt;

	let body = {
		instances: [
			{ prompt },
		],
		parameters: {
			aspectRatio:'4:3',
            sampleCount: 1
		}
        
	};

	let model_name = 'imagen-3.0-generate-002';

	let resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model_name}:predict?key=${API_KEY}`, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(body)
	});

	let result = await resp.json();

	console.log(result);
    
    let image_url;
    
	for(let i=0; i<result.predictions.length; i++) {
		let ext = '.png';
		if(result.predictions[i].mimeType == 'image/jpeg') {
			ext = '.jpg';
		}

		let filename = `output/${slugify(imagePrompt)}_${i+1}${ext}`;
		let buffer = Buffer.from(result.predictions[i].bytesBase64Encoded, 'base64');
        image_url = await uploadGenImageToS3(buffer, filename);
        console.log(`Uploaded to S3: ${image_url}`);
		//fs.writeFileSync(filename, buffer);
		//console.log(`Saving ${filename}`);
	}

    return image_url;
};

module.exports = {
    imageGen
};
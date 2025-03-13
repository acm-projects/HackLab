const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const slugify = require('slugify');
const fs = require('fs');

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
			aspectRatio:'4:3'
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

	for(let i=0; i<result.predictions.length; i++) {
		let ext = '.png';
		if(result.predictions[i].mimeType == 'image/jpeg') {
			ext = '.jpg';
		}

		let filename = `output/${slugify(imagePrompt)}_${i+1}${ext}`;
        //filename = `output/test_${i+1}${ext}`;
		let buffer = Buffer.from(result.predictions[i].bytesBase64Encoded, 'base64');
		fs.writeFileSync(filename, buffer);
		console.log(`Saving ${filename}`);
	}

    // return link to image in s3

};

module.exports = {
    imageGen
};
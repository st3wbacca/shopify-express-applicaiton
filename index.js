const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const PORT = process.env.PORT;
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;

const scopes = 'read_products';
const forwardingAddress = 'https://c42f74b1.ngrok.io'

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/shopify', (req, res) => {
	const shop = req.query.shop;
	if (shop) {
		const state = nonce();
		const redirectUri = forwardingAddress + '/shopify/callback';
		const installUri =
			'https://' + shop +
			'/admin/oauth/authorize?client_id=' + apiKey +
			'&scope=' + scopes +
			'&state=' + state +
			'&redirect_uri=' + redirectUri;

		res.cookie('state', state);
		res.redirect(installUri);
	} else {
		return res.status(400).send('Missing shop parameter. Please add ' +
			'?shop=your-development-shop.myshopify.com to you request');
	}
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}!`);
});
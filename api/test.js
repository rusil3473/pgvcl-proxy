// api/test.js

import https from "https";

export default async function handler(req, res) {

  try {

    const agent = new https.Agent({
      family: 4
    });

    const response = await fetch(
      "https://mdm-apraava.pgvcl.com/login",
      {
        agent
      }
    );

    const text = await response.text();

    res.json({
      success: true,
      status: response.status,
      length: text.length
    });

  } catch (err) {

    res.json({
      success: false,
      error: String(err)
    });

  }

}
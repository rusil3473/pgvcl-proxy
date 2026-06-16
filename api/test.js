export default async function handler(req, res) {
  try {

    const response = await fetch(
      "https://mdm-apraava.pgvcl.com/login"
    );

    const html = await response.text();

    res.json({
      success: true,
      status: response.status,
      length: html.length
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: String(err)
    });

  }
}
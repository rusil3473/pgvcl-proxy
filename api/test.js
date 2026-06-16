export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://mdm-apraava.pgvcl.com/login"
    );

    const text = await response.text();

    res.json({
      success: true,
      status: response.status,
      length: text.length
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
      cause: String(err?.cause)
    });

  }
}
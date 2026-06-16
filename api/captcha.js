export async function captcha() {
    try {


const r = await fetch(
  "https://mdm-apraava.pgvcl.com/consumerCaptchaImage"
);

const setCookies = r.headers.getSetCookie();

console.log("SET COOKIES:");
console.log(setCookies);

cookies = mergeCookies("", setCookies);

console.log("COOKIE JAR:");
console.log(cookies);

const buffer = Buffer.from(
  await r.arrayBuffer()
);

res.setHeader(
  "Content-Type",
  r.headers.get("content-type") || "image/jpeg"
);

res.send(buffer);


} catch (err) {


res.status(500).json({
  success: false,
  error: String(err)
});

}
}
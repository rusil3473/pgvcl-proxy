const express = require("express");

const app = express();

app.use(express.json());

let cookies = "";

const USERNAME = "9662923653";
const PASSWORD = "X17fs6hlSJLeQrJH55QMlw==";

function mergeCookies(oldCookies, setCookieHeaders) {

const jar = {};

if (oldCookies) {
oldCookies.split(";").forEach(c => {
const idx = c.indexOf("=");


  if (idx > 0) {
    const name = c.substring(0, idx).trim();
    const value = c.substring(idx + 1).trim();

    jar[name] = value;
  }
});


}

for (const cookie of setCookieHeaders) {


const firstPart = cookie.split(";")[0];

const idx = firstPart.indexOf("=");

if (idx > 0) {

  const name = firstPart.substring(0, idx).trim();
  const value = firstPart.substring(idx + 1).trim();

  jar[name] = value;
}


}

return Object.entries(jar)
.map(([k, v]) => `${k}=${v}`)
.join("; ");
}

app.get("/captcha", async (req, res) => {

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

});

app.get("/login/:captcha", async (req, res) => {

try {


const captcha = req.params.captcha;

console.log("LOGIN USING:");
console.log(cookies);

const body = new URLSearchParams({
  username: USERNAME,
  password: PASSWORD,
  consmCaptch: captcha
});

const r = await fetch(
  "https://mdm-apraava.pgvcl.com/consumerLogin/consumerLogin",
  {
    method: "POST",
    headers: {
      Cookie: cookies,
      "Content-Type":
        "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36",
      "Origin":
        "https://mdm-apraava.pgvcl.com",
      "Referer":
        "https://mdm-apraava.pgvcl.com/consumerLogin",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    },
    body,
    redirect: "manual"
  }
);

const text = await r.text();

const loginCookies = r.headers.getSetCookie();

cookies = mergeCookies(
  cookies,
  loginCookies
);

console.log("LOGIN STATUS:", r.status);
console.log("LOGIN LOCATION:", r.headers.get("location"));

console.log("FINAL COOKIE JAR:");
console.log(cookies);

res.json({
  success: true,
  status: r.status,
  location: r.headers.get("location"),
  contentType: r.headers.get("content-type"),
  length: text.length,
  preview: text.substring(0, 1000)
});


} catch (err) {


res.status(500).json({
  success: false,
  error: String(err)
});


}

});

app.get("/afterlogin", async (req, res) => {

try {

const r = await fetch(
  "https://mdm-apraava.pgvcl.com/consumerLogin/checkNewMitraMob",
  {
    headers: {
      Cookie: cookies,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36"
    }
  }
);

const text = await r.text();

res.send(text);


} catch (err) {


res.status(500).json({
  success: false,
  error: String(err)
});


}

});

app.get("/loadprofile/:date", async (req, res) => {

try {

const date = req.params.date;

const url =
  `https://mdm-apraava.pgvcl.com/consumerLogin/meterLoadProfile/36134011355/${date}`;

console.log("LOAD PROFILE URL:");
console.log(url);

console.log("LOAD PROFILE COOKIE JAR:");
console.log(cookies);

const r = await fetch(
  url,
  {
    headers: {
      Cookie: cookies,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36",
      "Referer":
        "https://mdm-apraava.pgvcl.com/consumerLogin"
    }
  }
);

const text = await r.text();

console.log("LOAD PROFILE STATUS:");
console.log(r.status);

console.log("LOAD PROFILE CONTENT TYPE:");
console.log(r.headers.get("content-type"));

res.json({
  status: r.status,
  contentType: r.headers.get("content-type"),
  length: text.length,
  preview: text.substring(0, 3000)
});


} catch (err) {


res.status(500).json({
  success: false,
  error: String(err)
});

}

});

app.listen(3000, () => {
console.log(
"Server running on http://localhost:3000"
);
});

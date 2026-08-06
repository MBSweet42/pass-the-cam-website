# Pass The Cam — Website

Plain HTML/CSS/JS site for Pass The Cam, built to run for free on GitHub Pages with the custom domain `passthecamus.com`.

## Previewing locally

No build step needed — just open `index.html` in a browser. For the most accurate preview (especially the contact form redirect), run a tiny local server from this folder instead of opening the file directly:

```
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Adding a real gallery photo

Open `gallery.html`, drop your new image file into `images/gallery/` (create that folder if it doesn't exist yet), then copy one of the existing blocks and edit it:

```html
<figure class="gallery-item">
  <img src="images/gallery/your-photo.jpg" alt="Describe the photo">
  <figcaption>
    <strong>Short Title</strong>
    <span>One-line description</span>
  </figcaption>
</figure>
```

Paste it anywhere inside `<div class="gallery-grid">`. No other files need to change — the click-to-enlarge lightbox works automatically for any image with the `gallery-item` class.

## Turning on the contact form (Formspree — free)

1. Go to [formspree.io](https://formspree.io) and sign up free using `hello@passthecamus.com`.
2. Create a new form and copy the form ID it gives you (it looks like `xxxxwxyz`).
3. In `contact.html`, find this line:
   ```html
   <form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
   and replace `YOUR_FORM_ID` with your real ID.
4. Submissions will be emailed to your Formspree account email, and visitors will be redirected to `thanks.html` after submitting. The free tier includes 50 submissions/month.

## Deploying to GitHub Pages (free)

1. Create a new **public** repository on GitHub named `pass-the-cam-website` (under your account).
2. From this folder, push the code:
   ```
   git remote add origin https://github.com/<your-username>/pass-the-cam-website.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub, go to the repo's **Settings → Pages**. Under "Build and deployment", set **Source** to "Deploy from a branch", branch `main`, folder `/ (root)`.
4. Still on the Pages settings screen, under "Custom domain" enter `passthecamus.com` and save (this matches the `CNAME` file already committed in this repo).

## Pointing passthecamus.com at GitHub Pages (free)

At whichever registrar/DNS provider manages `passthecamus.com` (wherever the domain was purchased/renewed), add these DNS records:

| Type  | Host/Name | Value                          |
|-------|-----------|---------------------------------|
| A     | @         | 185.199.108.153                |
| A     | @         | 185.199.109.153                |
| A     | @         | 185.199.110.153                |
| A     | @         | 185.199.111.153                |
| CNAME | www       | `<your-username>.github.io`    |

DNS changes can take anywhere from a few minutes to 24 hours to fully propagate. Once it has, go back to **Settings → Pages** on GitHub and check "Enforce HTTPS" for a secure padlock.

Total cost: **$0** for hosting (GitHub Pages) and the contact form (Formspree free tier) — the only ongoing cost is whatever you already pay to keep the `passthecamus.com` domain registered.

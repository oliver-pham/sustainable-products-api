require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function emailTemplate(category, products) {
    let body = `<h3>${category}</h3><ol>`;
    if (products.length > 0) {
        let list = products.reduce((productList, product) => {
          return (
            productList +
            `
            <li>
                <p>Brand Name: ${product.brand_name}</p>
                <p>Model Name: ${product.model_name}</p>
                <p>Model Number: ${product.model_number}</p>
            </li>
        `
          );
        }, "");

        return body + list + "</ol>";
    }
    else return body + "</ol>";
}


function notify(destination, suggestions) {
    var template;

    if (suggestions.length > 0) {
        var recommendations = suggestions.reduce(
          (content, suggestion) => {
              return (
                content +
                emailTemplate(suggestion.category, suggestion.products)
              );
          },
          ""
        );
        template = `
        <!doctype html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Simple Transactional Email</title>
            <style>
            /* -------------------------------------
                INLINED WITH htmlemail.io/inline
            ------------------------------------- */
            /* -------------------------------------
                RESPONSIVE AND MOBILE FRIENDLY STYLES
            ------------------------------------- */
            @media only screen and (max-width: 620px) {
              table[class=body] h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important;
              }
              table[class=body] p,
                    table[class=body] ul,
                    table[class=body] ol,
                    table[class=body] td,
                    table[class=body] span,
                    table[class=body] a {
                font-size: 16px !important;
              }
              table[class=body] .wrapper,
                    table[class=body] .article {
                padding: 10px !important;
              }
              table[class=body] .content {
                padding: 0 !important;
              }
              table[class=body] .container {
                padding: 0 !important;
                width: 100% !important;
              }
              table[class=body] .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important;
              }
              table[class=body] .btn table {
                width: 100% !important;
              }
              table[class=body] .btn a {
                width: 100% !important;
              }
              table[class=body] .img-responsive {
                height: auto !important;
                max-width: 100% !important;
                width: auto !important;
              }
            }

            /* -------------------------------------
                PRESERVE THESE STYLES IN THE HEAD
            ------------------------------------- */
            @media all {
              .ExternalClass {
                width: 100%;
              }
              .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                line-height: 100%;
              }
              .apple-link a {
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                text-decoration: none !important;
              }
              #MessageViewBody a {
                color: inherit;
                text-decoration: none;
                font-size: inherit;
                font-family: inherit;
                font-weight: inherit;
                line-height: inherit;
              }
              .btn-primary table td:hover {
                background-color: #34495e !important;
              }
              .btn-primary a:hover {
                background-color: #34495e !important;
                border-color: #34495e !important;
              }
            }
            </style>
          </head>
          <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
            <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Hi there! Here are some recommendations for your business</span>
            <svg width="" height="69" viewBox="0 0 395 77" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M110.736 35.432H89.616C89.808 38.056 90.816 40.184 92.64 41.816C94.464 43.416 96.768 44.216 99.552 44.216C101.12 44.216 102.56 43.944 103.872 43.4C105.184 42.824 106.32 41.992 107.28 40.904L109.2 43.112C108.08 44.456 106.672 45.48 104.976 46.184C103.312 46.888 101.472 47.24 99.456 47.24C96.864 47.24 94.56 46.696 92.544 45.608C90.56 44.488 89.008 42.952 87.888 41C86.768 39.048 86.208 36.84 86.208 34.376C86.208 31.912 86.736 29.704 87.792 27.752C88.88 25.8 90.352 24.28 92.208 23.192C94.096 22.104 96.208 21.56 98.544 21.56C100.88 21.56 102.976 22.104 104.832 23.192C106.688 24.28 108.144 25.8 109.2 27.752C110.256 29.672 110.784 31.88 110.784 34.376L110.736 35.432ZM98.544 24.488C96.112 24.488 94.064 25.272 92.4 26.84C90.768 28.376 89.84 30.392 89.616 32.888H107.52C107.296 30.392 106.352 28.376 104.688 26.84C103.056 25.272 101.008 24.488 98.544 24.488ZM128.185 47.24C125.689 47.24 123.449 46.696 121.465 45.608C119.513 44.52 117.977 43 116.857 41.048C115.737 39.064 115.177 36.84 115.177 34.376C115.177 31.912 115.737 29.704 116.857 27.752C117.977 25.8 119.513 24.28 121.465 23.192C123.449 22.104 125.689 21.56 128.185 21.56C130.361 21.56 132.297 21.992 133.993 22.856C135.721 23.688 137.081 24.92 138.073 26.552L135.529 28.28C134.697 27.032 133.641 26.104 132.361 25.496C131.081 24.856 129.689 24.536 128.185 24.536C126.361 24.536 124.713 24.952 123.241 25.784C121.801 26.584 120.665 27.736 119.833 29.24C119.033 30.744 118.633 32.456 118.633 34.376C118.633 36.328 119.033 38.056 119.833 39.56C120.665 41.032 121.801 42.184 123.241 43.016C124.713 43.816 126.361 44.216 128.185 44.216C129.689 44.216 131.081 43.912 132.361 43.304C133.641 42.696 134.697 41.768 135.529 40.52L138.073 42.248C137.081 43.88 135.721 45.128 133.993 45.992C132.265 46.824 130.329 47.24 128.185 47.24ZM154.666 47.24C152.234 47.24 150.042 46.696 148.09 45.608C146.138 44.488 144.602 42.952 143.482 41C142.362 39.048 141.802 36.84 141.802 34.376C141.802 31.912 142.362 29.704 143.482 27.752C144.602 25.8 146.138 24.28 148.09 23.192C150.042 22.104 152.234 21.56 154.666 21.56C157.098 21.56 159.29 22.104 161.242 23.192C163.194 24.28 164.714 25.8 165.802 27.752C166.922 29.704 167.482 31.912 167.482 34.376C167.482 36.84 166.922 39.048 165.802 41C164.714 42.952 163.194 44.488 161.242 45.608C159.29 46.696 157.098 47.24 154.666 47.24ZM154.666 44.216C156.458 44.216 158.058 43.816 159.466 43.016C160.906 42.184 162.026 41.016 162.826 39.512C163.626 38.008 164.026 36.296 164.026 34.376C164.026 32.456 163.626 30.744 162.826 29.24C162.026 27.736 160.906 26.584 159.466 25.784C158.058 24.952 156.458 24.536 154.666 24.536C152.874 24.536 151.258 24.952 149.818 25.784C148.41 26.584 147.29 27.736 146.458 29.24C145.658 30.744 145.258 32.456 145.258 34.376C145.258 36.296 145.658 38.008 146.458 39.512C147.29 41.016 148.41 42.184 149.818 43.016C151.258 43.816 152.874 44.216 154.666 44.216ZM174.44 11.384H177.848V47H174.44V11.384ZM197.65 47.24C195.218 47.24 193.026 46.696 191.074 45.608C189.122 44.488 187.586 42.952 186.466 41C185.346 39.048 184.786 36.84 184.786 34.376C184.786 31.912 185.346 29.704 186.466 27.752C187.586 25.8 189.122 24.28 191.074 23.192C193.026 22.104 195.218 21.56 197.65 21.56C200.082 21.56 202.274 22.104 204.226 23.192C206.178 24.28 207.698 25.8 208.786 27.752C209.906 29.704 210.466 31.912 210.466 34.376C210.466 36.84 209.906 39.048 208.786 41C207.698 42.952 206.178 44.488 204.226 45.608C202.274 46.696 200.082 47.24 197.65 47.24ZM197.65 44.216C199.442 44.216 201.042 43.816 202.45 43.016C203.89 42.184 205.01 41.016 205.81 39.512C206.61 38.008 207.01 36.296 207.01 34.376C207.01 32.456 206.61 30.744 205.81 29.24C205.01 27.736 203.89 26.584 202.45 25.784C201.042 24.952 199.442 24.536 197.65 24.536C195.858 24.536 194.242 24.952 192.802 25.784C191.394 26.584 190.274 27.736 189.442 29.24C188.642 30.744 188.242 32.456 188.242 34.376C188.242 36.296 188.642 38.008 189.442 39.512C190.274 41.016 191.394 42.184 192.802 43.016C194.242 43.816 195.858 44.216 197.65 44.216ZM240.8 21.752V43.928C240.8 48.216 239.744 51.384 237.632 53.432C235.552 55.512 232.4 56.552 228.176 56.552C225.84 56.552 223.616 56.2 221.504 55.496C219.424 54.824 217.728 53.88 216.416 52.664L218.144 50.072C219.36 51.16 220.832 52.008 222.56 52.616C224.32 53.224 226.16 53.528 228.08 53.528C231.28 53.528 233.632 52.776 235.136 51.272C236.64 49.8 237.392 47.496 237.392 44.36V41.144C236.336 42.744 234.944 43.96 233.216 44.792C231.52 45.624 229.632 46.04 227.552 46.04C225.184 46.04 223.024 45.528 221.072 44.504C219.152 43.448 217.632 41.992 216.512 40.136C215.424 38.248 214.88 36.12 214.88 33.752C214.88 31.384 215.424 29.272 216.512 27.416C217.632 25.56 219.152 24.12 221.072 23.096C222.992 22.072 225.152 21.56 227.552 21.56C229.696 21.56 231.632 21.992 233.36 22.856C235.088 23.72 236.48 24.968 237.536 26.6V21.752H240.8ZM227.888 43.016C229.712 43.016 231.36 42.632 232.832 41.864C234.304 41.064 235.44 39.96 236.24 38.552C237.072 37.144 237.488 35.544 237.488 33.752C237.488 31.96 237.072 30.376 236.24 29C235.44 27.592 234.304 26.504 232.832 25.736C231.392 24.936 229.744 24.536 227.888 24.536C226.064 24.536 224.416 24.92 222.944 25.688C221.504 26.456 220.368 27.544 219.536 28.952C218.736 30.36 218.336 31.96 218.336 33.752C218.336 35.544 218.736 37.144 219.536 38.552C220.368 39.96 221.504 41.064 222.944 41.864C224.416 42.632 226.064 43.016 227.888 43.016ZM250.33 21.752H253.738V47H250.33V21.752ZM252.058 16.232C251.354 16.232 250.762 15.992 250.282 15.512C249.802 15.032 249.562 14.456 249.562 13.784C249.562 13.144 249.802 12.584 250.282 12.104C250.762 11.624 251.354 11.384 252.058 11.384C252.762 11.384 253.354 11.624 253.834 12.104C254.314 12.552 254.554 13.096 254.554 13.736C254.554 14.44 254.314 15.032 253.834 15.512C253.354 15.992 252.762 16.232 252.058 16.232Z" fill="black"/>
<path d="M274.405 47.384C271.653 47.384 269.173 46.824 266.965 45.704C264.789 44.552 263.077 42.968 261.829 40.952C260.613 38.936 260.005 36.648 260.005 34.088C260.005 31.528 260.613 29.24 261.829 27.224C263.077 25.208 264.789 23.64 266.965 22.52C269.173 21.368 271.653 20.792 274.405 20.792C277.125 20.792 279.493 21.368 281.509 22.52C283.557 23.64 285.045 25.256 285.973 27.368L280.165 30.488C278.821 28.12 276.885 26.936 274.357 26.936C272.405 26.936 270.789 27.576 269.509 28.856C268.229 30.136 267.589 31.88 267.589 34.088C267.589 36.296 268.229 38.04 269.509 39.32C270.789 40.6 272.405 41.24 274.357 41.24C276.917 41.24 278.853 40.056 280.165 37.688L285.973 40.856C285.045 42.904 283.557 44.504 281.509 45.656C279.493 46.808 277.125 47.384 274.405 47.384ZM302.244 47.384C299.524 47.384 297.076 46.824 294.9 45.704C292.756 44.552 291.076 42.968 289.86 40.952C288.644 38.936 288.036 36.648 288.036 34.088C288.036 31.528 288.644 29.24 289.86 27.224C291.076 25.208 292.756 23.64 294.9 22.52C297.076 21.368 299.524 20.792 302.244 20.792C304.964 20.792 307.396 21.368 309.54 22.52C311.684 23.64 313.364 25.208 314.58 27.224C315.796 29.24 316.404 31.528 316.404 34.088C316.404 36.648 315.796 38.936 314.58 40.952C313.364 42.968 311.684 44.552 309.54 45.704C307.396 46.824 304.964 47.384 302.244 47.384ZM302.244 41.24C304.164 41.24 305.732 40.6 306.948 39.32C308.196 38.008 308.82 36.264 308.82 34.088C308.82 31.912 308.196 30.184 306.948 28.904C305.732 27.592 304.164 26.936 302.244 26.936C300.324 26.936 298.74 27.592 297.492 28.904C296.244 30.184 295.62 31.912 295.62 34.088C295.62 36.264 296.244 38.008 297.492 39.32C298.74 40.6 300.324 41.24 302.244 41.24Z" fill="#3CBA92"/>
<path d="M2.00391 70.5943C3.58906 19.3412 -3.27994 8.24519 71.2224 8.24512" stroke="black" stroke-width="3"/>
<path d="M2.00391 70.5943C3.58906 19.3412 -3.27994 8.24519 71.2224 8.24512" stroke="black" stroke-width="3"/>
<path d="M70.2585 8C53.3502 52.8748 40.2548 54.743 16.4775 53.1578" stroke="black" stroke-width="3"/>
            <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
              <tr>
                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

                    <!-- START CENTERED WHITE CONTAINER -->
                    <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

                      <!-- START MAIN CONTENT AREA -->
                      <tr>
                        <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                            <tr>
                              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi there,</p>
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Here are some recommendations for your business:</p>
                                <p>${recommendations}</p>
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We hope you find this useful!</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                    <!-- END MAIN CONTENT AREA -->
                    </table>

                    <!-- START FOOTER -->
                    <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                      <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                        <tr>
                          <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                            <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Sent by Ecologico</span>
                            <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">Unsubscribe</a>.
                          </td>
                        </tr>
                      </table>
                    </div>
                    <!-- END FOOTER -->

                  <!-- END CENTERED WHITE CONTAINER -->
                  </div>
                </td>
                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
              </tr>
            </table>
          </body>
        </html>
        `;
    }
    
    const msg = {
      to: destination,
      from: process.env.SENDGRID_SENDER,
      subject: "Ecologico: Product Recommendations",
      html: template,
    };

    sgMail.send(msg).then(
      () => {},
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
}

module.exports = notify;
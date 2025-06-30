const nodemailer = require("nodemailer");

function sendServiceEmail({ email, serviceType, bookingDetails }) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASS,
            },
        });

        let subject, greeting, messageIntro, serviceDetails, nextSteps;
        
        if (serviceType === "Career Counseling") {
            subject = "Your Career Counseling Session Booking Confirmation";
            greeting = "Career Counseling Session Booked!";
            messageIntro = "Thank you for booking a career counseling session with SkillSync. Here are your booking details:";
            serviceDetails = `
                <p><strong>Service Type:</strong> Career Counseling</p>
                <p><strong>What to expect:</strong></p>
                <ul>
                    <li>Personalized session based on your goals and field</li>
                    <li>Industry trends analysis</li>
                    <li>Academic advice and roadmap planning</li>
                    <li>Guidance on higher education and career paths</li>
                </ul>
            `;
            nextSteps = "Our career counselor will contact you within 24 hours to confirm your session time and discuss your goals.";
        } 
        else if (serviceType === "FYP Consultation") {
            subject = "Your FYP Consultation Booking Confirmation";
            greeting = "Final Year Project Consultation Booked!";
            messageIntro = "Thank you for booking a Final Year Project consultation with SkillSync. Here are your booking details:";
            serviceDetails = `
                <p><strong>Service Type:</strong> FYP Consultation</p>
                <p><strong>What to expect:</strong></p>
                <ul>
                    <li>Idea refinement and topic selection</li>
                    <li>Project planning and management</li>
                    <li>Documentation support (SRS, reports)</li>
                    <li>Testing strategies implementation</li>
                </ul>
                <p><strong>Fields covered:</strong> Software, AI, Mechatronics, Robotics, Electronics, Data Science</p>
            `;
            nextSteps = "Our FYP consultant will review your project details and contact you within 24 hours to schedule your first session.";
        }

        const mailConfigs = {
            from: process.env.MY_EMAIL,
            to: email,
            subject,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${subject}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Poppins', Arial, sans-serif;
            background-color: #f5f6fa;
            margin: 0;
            padding: 0;
            color: #2d3436;
        }
        
        .container {
            max-width: 600px;
            margin: 20px auto;
            border-radius: 12px;
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .header {
            background: linear-gradient(135deg, #0E76A8 0%, #00B894 100%);
            padding: 30px 0;
            text-align: center;
            position: relative;
        }
        
        .logo-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .logo-text {
            color: white;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 1px;
            margin-left: 10px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background-color: #fdcb6e;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #2d3436;
            font-weight: bold;
            font-size: 20px;
        }
        
        .tagline {
            color: rgba(255,255,255,0.9);
            font-size: 14px;
            margin-top: 5px;
            font-weight: 300;
        }
        
        .content {
            padding: 35px 40px;
            line-height: 1.6;
        }
        
        .greeting {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #0E76A8;
        }
        
        .message {
            margin-bottom: 25px;
            font-size: 15px;
            color: #2d3436;
        }
        
        .details-container {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
            border: 1px solid #e9ecef;
        }
        
        .details-label {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .booking-details {
            font-size: 16px;
            margin: 15px 0;
        }
        
        .booking-details p {
            margin: 10px 0;
            color: #2d3436;
        }
        
        .service-details ul {
            padding-left: 20px;
            margin: 15px 0;
        }
        
        .service-details li {
            margin-bottom: 8px;
        }
        
        .next-steps {
            background-color: #e8f4fd;
            border-left: 4px solid #0E76A8;
            padding: 20px;
            margin: 25px 0;
            font-size: 15px;
            border-radius: 4px;
            color: #2d3436;
        }
        
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #0E76A8 0%, #00B894 100%);
            color: white;
            padding: 14px 32px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 500;
            margin: 25px 0;
            text-align: center;
            box-shadow: 0 4px 10px rgba(14, 118, 168, 0.3);
            transition: all 0.3s ease;
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(14, 118, 168, 0.4);
        }
        
        .support {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            font-size: 14px;
            text-align: center;
            border: 1px solid #e9ecef;
        }
        
        .support p {
            margin: 8px 0;
            color: #2d3436;
        }
        
        .footer {
            background-color: #2d3436;
            padding: 25px;
            text-align: center;
            color: #f5f6fa;
            font-size: 13px;
        }
        
        .social-icons {
            margin: 20px 0;
        }
        
        .social-icons a {
            display: inline-block;
            margin: 0 10px;
            color: #f5f6fa;
            text-decoration: none;
            font-size: 16px;
        }
        
        .footer-links {
            margin: 15px 0;
        }
        
        .footer-links a {
            color: #fdcb6e;
            text-decoration: none;
            margin: 0 12px;
            font-size: 12px;
        }
        
        .copyright {
            margin-top: 20px;
            color: rgba(245,246,250,0.7);
            font-size: 12px;
        }
        
        @media only screen and (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            
            .content {
                padding: 25px 20px;
            }
            
            .logo-text {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <div class="logo-icon">S</div>
                <div class="logo-text">SkillSync</div>
            </div>
            <div class="tagline">From Campus to Career - We Sync Your Skills</div>
        </div>
        
        <div class="content">
            <p class="greeting">${greeting}</p>
            
            <p class="message">${messageIntro}</p>
            
            <div class="details-container">
                <div class="booking-details">
                    <p><strong>Name:</strong> ${bookingDetails.name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${bookingDetails.phone || 'Not provided'}</p>
                    <p><strong>Preferred Date:</strong> ${bookingDetails.date || 'To be scheduled'}</p>
                    ${bookingDetails.message ? `<p><strong>Your Message:</strong> ${bookingDetails.message}</p>` : ''}
                </div>
                
                <div class="service-details">
                    ${serviceDetails}
                </div>
            </div>
            
            <div class="next-steps">
                <p><strong>Next Steps:</strong> ${nextSteps}</p>
                <p>We're excited to work with you and help you achieve your academic and career goals!</p>
            </div>
            
            <div class="support">
                <p><strong>Need help or have questions?</strong></p>
                <p>Our support team is always here to assist you.</p>
                <p>📧 Email: support@skillsync.com</p>
                <p>📞 Phone: +1 (555) 123-4567</p>
            </div>
        </div>
        
        <div class="footer">
            <div class="social-icons">
                <a href="#">Facebook</a>
                <a href="#">Twitter</a>
                <a href="#">LinkedIn</a>
                <a href="#">Instagram</a>
            </div>
            
            <div class="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Us</a>
                <a href="#">Careers</a>
            </div>
            
            <div class="copyright">
                <p>&copy; ${new Date().getFullYear()} SkillSync. All rights reserved.</p>
                <p>Guiding Tech Talent from Ideas to Impact</p>
            </div>
        </div>
    </div>
</body>
</html>
            `,
        };

        transporter.sendMail(mailConfigs, function (error, info) {
            if (error) {
                console.error(error);
                return reject({
                    message: `An error occurred while sending the email`,
                });
            }
            console.log("Email sent: " + info.response);
            return resolve({ message: "Email sent successfully" });
        });
    });
}

module.exports = sendServiceEmail;
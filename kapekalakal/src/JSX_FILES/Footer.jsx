import "../CSS_FILES/Footer.css";
import { Link } from "react-router-dom";
function Footer() {
	return (
		<>
			<div className="main-f-con">
				<div className="footer-con footcon1">
					<div className="foot-sub-div foot-sub-div1">
						<img className="logo1" src="/LOGO.svg" alt="Logo" />
						<p className="shopname">KAPE KALAKAL </p>
					</div>
					<div className="foot-sub-div foot-sub-div2">
						{" "}
						<h3 className="tag2-1">Fueling Mornings, Brewing Connections</h3>
					</div>
					<div className="foot-sub-div foot-sub-div3">
						<div>
							<img
								className="f-logo f-logo1"
								src="./logos/INSTAGRAM.png"
								alt="INSTAGRAM.png"
							/>
						</div>
						<div>
							<img
								className="f-logo f-logo2"
								src="./logos/TIKTOK.png"
								alt="TIKTOK.png"
							/>
						</div>
						<div>
							<img
								className="f-logo f-logo3"
								src="./logos/FACEBOOK.png"
								alt="FACEBOOK.png"
							/>
						</div>
						<div>
							<img
								className="f-logo f-logo4"
								src="./logos/LAZADA.png"
								alt="LAZADA.png"
							/>
						</div>
						<div>
							<img
								className="f-logo f-logo5"
								src="./logos/SHOPPEE.png"
								alt="SHOPPEE.pngg"
							/>
						</div>
					</div>

					<div className="foot-sub-div foot-sub-div4">
						<div className="concon">
							<i className="fa-solid fa-2xl mt-4 arrow fa-arrow-up"></i>{" "}
							<p className="copyright">
								Copyright @ 2025 Aces S. Hapiz All Rights Reserved
							</p>
						</div>
					</div>
				</div>
				<div className="footer-con footcon2">
					<h4 className="site-map-header">SITE MAP</h4>
					<p className="pages pages1">LANDING PAGE</p>
					<p className="pages pages1">ABOUT</p>
					<p className="pages pages1">SHOP</p>
					<p className="pages pages1">LOGIN</p>
				</div>
				<div className="footer-con footcon3">
					<h4 className="legal-header">LEGAL</h4>
					<p>Privacy Policy</p>
					<p>Terms of Services</p>
					<p>Lawyer's Corners</p>
				</div>
			</div>
		</>
	);
}

export default Footer;

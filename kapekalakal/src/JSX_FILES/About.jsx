import "../CSS_FILES/About.css";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";

function About() {
	return (
		<>
			<NavBar />
			<div className="about-con">
				<div>
					{" "}
					<h1 className="about-header">ABOUT KAPE KALAKAL</h1>
					<h3 className="tag2">Fueling Mornings, Brewing Connections</h3>
					<p className="story">
						At Kape Kalakal, we believe that a good cup of coffee can do more
						than just wake you up—it can bring people together. Our journey
						began with a simple love for coffee and a deep appreciation for the
						craft behind it. As Filipino coffee lovers, we wanted to create a
						space where local flavors, artisanal tools, and passionate stories
						come together in one place. That dream became Kape Kalakal—an
						e-commerce store dedicated to fueling mornings and brewing
						connections across communities. We proudly partner with local
						farmers and small businesses, showcasing high-quality beans and
						brewing essentials that represent the best of Philippine coffee
						culture. Every purchase you make helps support sustainable farming,
						ethical trade, and the hardworking hands behind every harvest.
						Whether you're a seasoned home barista or just starting your coffee
						journey, our goal is to help you craft better brews—and build
						meaningful moments with every cup. Kape Kalakal is more than just a
						store. It’s a community. A movement. A celebration of slow mornings,
						shared stories, and the joy of a perfectly brewed cup. Welcome to
						the brew-tiful journey.
					</p>
				</div>
				<div className="pic-con">
					<img className="decor decor1" src="/mugpics/MUG.png" alt="MUG.png" />
					<img
						className="decor decor2"
						src="/mugpics/SHOP.png"
						alt="SHOP.png"
					/>
					<img
						className="decor decor3"
						src="/mugpics/SHOP (1).png"
						alt="SHOP (1).png"
					/>
					<img className="decor decor1" src="/mugpics/MUG.png" alt="MUG.png" />
				</div>
			</div>

			<img className="bean0" src="./logos/bean.png" alt="bean.png" />
			<img className="bean1" src="./logos/bean.png" alt="bean.png" />
			<img
				className="mug"
				src="/mugpics/vectormug-removebg-preview.png"
				alt="vectormug-removebg-preview.png"
			/>

			<div className="shop-details">
				<h2 className="ptag">
					IN <br /> PARTNERSHIP <br />
					WITH
				</h2>
				<img
					className="logos logo1-1"
					src="./logos/DUNKIN.png"
					alt="DUNKIN.png"
				/>
				<img
					className="logos logo2"
					src="./logos/STARBUCKS.png"
					alt="STARBUCKS.png"
				/>
				<img
					className="logos logo3"
					src="./logos/TIMHORTONS.png"
					alt="TIMHORTONS.png"
				/>
			</div>

			<h2 className="best-header">BEST SELLERS</h2>

			<div className="best">
				<div className="product-card">
					<img
						className="product"
						src="/products/AeroPress Coffee Maker.png"
						alt="AeroPress Coffee Maker.png"
					/>
					<p>AEROPRESS COFFEE MAKER</p>
					<p>PHP 4290.00</p>
				</div>
				<div className="product-card">
					<img
						className="product"
						src="/products/Pourx Oura Coffee Scale.png"
						alt="AeroPress Coffee Maker.png"
					/>
					<p>POURX OURA COFFEE SCALE</p>
					<p>PHP 10,290.00</p>
				</div>
				<div className="product-card">
					<img
						className="product"
						src="/products/Kalita Wave Tsubame 155 Copper Dripper.png"
						alt="AeroPress Coffee Maker.png"
					/>
					<p>KALITA WAVE TSUBAME 155</p>
					<p>PHP 4290.00</p>
				</div>
				<div className="product-card">
					<img
						className="product"
						src="/products/Cafec Tritan Coffee Server.png"
						alt="AeroPress Coffee Maker.png"
					/>
					<p>CAFEC TRITAN COFFEE SERVER</p>
					<p>PHP 1100.00</p>
				</div>
				<div className="product-card">
					<img
						className="product"
						src="/products/Hario Insulated Mug with Lid 300.png"
						alt="Hario Insulated Mug with Lid 300.png"
					/>
					<p>HARIO INSULATED MUG</p>
					<p>PHP 1050.00</p>
				</div>
			</div>

			<Link to="/shop">
				<button className="shop-but" type="button">
					OPEN SHOP
				</button>
			</Link>

			<Footer />
		</>
	);
}

export default About;

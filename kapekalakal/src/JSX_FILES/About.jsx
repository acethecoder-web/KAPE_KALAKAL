import "../CSS_FILES/About.css";

function About() {
	return (
		<>
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
					<img className="decor decor1" src="/mugpics/MUG.png" alt="" />
					<img className="decor decor2" src="/mugpics/SHOP.png" alt="" />
					<img className="decor decor3" src="/mugpics/SHOP (1).png" alt="" />
					<img className="decor decor1" src="/mugpics/MUG.png" alt="" />
				</div>
			</div>
		</>
	);
}

export default About;

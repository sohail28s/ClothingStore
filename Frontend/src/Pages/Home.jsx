import HeroSlider from '../Components/HeroSlider';
import PromoBlock from '../Components/PromoBlock';
import ExploreCategory from '../Components/ExploreCategory';
import FeaturesGrid from '../Components/FeaturesGrid';


function Home() {
  return (
    <div className="relative w-full min-h-screen font-central">
     
        <HeroSlider />
        <PromoBlock/>
        <ExploreCategory/>
        <FeaturesGrid />
     
    </div>
  );
}

export default Home
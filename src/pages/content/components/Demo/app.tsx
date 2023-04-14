import { useEffect, useState } from "react";
import CartOrder from "@src/pages/content/components/Demo/cartorder";
import { fetchVendorListing } from '../../../../../source/Service/listVendor';
import Button, { ButtonStatusType } from '@deliveryhero/pd-cookbook/components/Button';
import { PDModal } from './Modal';
import './app.scss';
import { ButtonCircular } from "@deliveryhero/pd-cookbook/components/ButtonCircular";
import IcBackPack from '@deliveryhero/pd-cookbook/components/Icons/IcBackPack';
import '../../style.scss'

interface IFetchVendorResponse {

}
interface Cuisine {
  id: number
  title: string
  url_key: string
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState<ButtonStatusType>('default');
  const [allCuisines, setAllCuisines] = useState<Cuisine[]>([]);
  const [allVendors, setAllVendors] = useState<any[]>([]);

  useEffect(() => {
    console.log("content view loaded");
  }, []);

  const handleClick = () => {
    findRandomVendor(() => setModalOpen(true));
  }

  const findRandomVendor = (callback: any) => {
    setLoading('loading');
    const vendors = fetchVendorListing(null, null);
    vendors
      .then((data) => {
        console.log(data.data.rlp.organic_listing.views[0].items)
        setAllVendors(data.data.rlp.organic_listing.views[0].items)
        setAllCuisines(data.data.rlp.organic_listing.views[0].aggregations.cuisines)
        setLoading('default');
        callback()
      })
      .catch((error) => {
        console.log(error);
        setLoading('default');
      });
  }


  return (
		<>
			<CartOrder />
			<div className="content-view">
				<Button className="content-view" onClick={handleClick} status={loading}>
					Feeling Hungry
				</Button>
				<PDModal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					allCuisines={allCuisines}
					allVendors={allVendors}
				/>
			</div>
		</>
  );
}

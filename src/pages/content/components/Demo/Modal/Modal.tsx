import { useEffect, useState } from 'react';
import { fetchVendorListing } from '../../../../../../source/Service/listVendor';
import Button, { ButtonProps, ButtonStatusType } from '@deliveryhero/pd-cookbook/components/Button';
import { PreferenceForm } from './PreferenceForm';
import { Typography } from '@deliveryhero/pd-cookbook/components/Typography';
import Box from '@deliveryhero/pd-cookbook/components/Box';
import Modal, { ModalBody, ModalFooter, ModalTitle } from '@deliveryhero/pd-cookbook/components/AccessibleModal';
import { Pill } from '@deliveryhero/pd-cookbook/components/Pill';
import { LoadingDotsIndicator } from '@deliveryhero/pd-cookbook/components/LoadingDotsIndicator';
import IcBackPack from '@deliveryhero/pd-cookbook/components/Icons/IcBackPack';
import { Tooltip } from '@deliveryhero/pd-cookbook/components/Tooltip';
import { DropdownOptionType } from '@deliveryhero/pd-cookbook/components/Dropdown';

interface Props {
    open: boolean
    onClose: any
    allCuisines: Cuisine[]
    allVendors: any[]
}

interface Cuisine {
    id: number
    title: string
    url_key: string
}

// create a dynamic interface of object string to string
interface Vendor {
    id: number
    code: string
    budget: number
    characteristics: {
        cuisines: Cuisine[]
    }
    minimum_delivery_fee: number
    minimum_delivery_time: number
    name: string
    rating: number
}

const PDModal: React.FC<Props> = ({ open, onClose, allCuisines, allVendors }) => {
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState<ButtonStatusType>('default');
    const [priceLimit, setPriceLimit] = useState<number>(30);
    const [deliveryTime, setDeliveryTime] = useState<number>(50);
    const [selectedCuisines, setSelectedCuisines] = useState<Cuisine[]>([]);
    const [allowedVendors, setAllowedVendors] = useState<any[]>(allVendors);

    useEffect(() => {
        // init after loading all vendors
        const allowedVendors = allVendors
            .filter(vendor => {
                var foundDeliveryTime: boolean;

                if (vendor.minimum_delivery_time <= deliveryTime) {
                    foundDeliveryTime = true
                }

                return foundDeliveryTime;
            })
        setAllowedVendors(allowedVendors)

    }, [allVendors])

    useEffect(() => {
        const selectedCuisineIds = selectedCuisines.map(cuisine => cuisine.id);
        const allowedVendors = allVendors
            .filter(vendor => {
                var foundDeliveryTime: boolean;
                var foundCuisine: boolean = selectedCuisines.length == 0;

                if (vendor.minimum_delivery_time <= deliveryTime) {
                    foundDeliveryTime = true
                }

                if (selectedCuisines.length > 0 && vendor.characteristics.cuisines && vendor.characteristics.cuisines.length > 0) {
                    const found = vendor.characteristics.cuisines.filter((cuisine: Cuisine) => {
                        return selectedCuisineIds.includes(cuisine.id)
                    })
                    if (found.length > 0) {
                        foundCuisine = true
                    }
                }
                return foundDeliveryTime && foundCuisine;
            })
        setAllowedVendors(allowedVendors)
    }, [deliveryTime, selectedCuisines])

    const pickRandomIdx = (n: number): number => {
        return Math.floor(Math.random() * n);
    }

    const redirectToVendor = (vendorCode: string, urlKey: string, priceLimit: number) => {
        window.location.href = `/restaurant/${vendorCode}/${urlKey}?priceLimit=${priceLimit}`;
    }

    const handleSubmit = () => {
        console.log(selectedCuisines)
        const selectedCuisineIds = selectedCuisines.map(cuisine => cuisine.id);
        console.log('selectedCuisineIds: ', selectedCuisineIds)
        var allowedVendors = allVendors;
        const randIdx = pickRandomIdx(allowedVendors.length)
        redirectToVendor(allowedVendors[randIdx].code, allowedVendors[randIdx].url_key, priceLimit)
    }

    const mapCuisinesToDropDownValue = (cuisines: Cuisine[]): DropdownOptionType[] => {
        return cuisines.map((cuisine) => ({
            label: cuisine.title,
            value: cuisine.id.toString(),
            urlKey: cuisine.url_key
        }))
    }

    return (
        <Modal
            label="Surprise me"
            isOpen={open}
            onClose={onClose}>
            <ModalTitle title="Surprise me" subTitle="" />
            <ModalBody>
                <Box marginBottom="sm">
                    <Typography as="p" type="paragraph-md">
                        There are <b>{allowedVendors.length}</b> restaurants meeting your criterias
                    </Typography>
                    {/* <Typography as="p" type="paragraph-md">
                        Get ready for a unique culinary adventure every time you order with our new random menu generator! With a single click, you’ll be presented with a mouth-watering selection of dishes that will take your taste buds on a journey they’ll never forget.
                    </Typography> */}
                </Box>
                <PreferenceForm
                    cuisinesDropDownValue={mapCuisinesToDropDownValue(allCuisines)}
                    setPriceLimit={setPriceLimit}
                    setSelectedCuisines={setSelectedCuisines}
                    setDeliveryTime={setDeliveryTime}
                    selectedCuisines={selectedCuisines}
                    priceLimit={priceLimit}
                    deliveryTime={deliveryTime}
                />
            </ModalBody>
            <ModalFooter>
                <Button kind="primary-reversed" onClick={onClose} style={{ marginRight: '20px' }}>
                    Close
                </Button>
                <Button kind="primary" onClick={handleSubmit} status={submitLoading}>
                    Surprise me
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export { PDModal };


import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { BANNER_ENDPOINT } from '../configs/endpoints';
import { BannerModel } from '../models/banner';


export const getAllBanner = async (): Promise<BannerModel[]> => {
  try {
    const q = query(collection(db, BANNER_ENDPOINT), where('status', '==', true), limit(5));
    const res = await getDocs(q);

    const filteredData: BannerModel[] = res?.docs?.map((doc) => {
      const data = doc?.data() as BannerModel;
      data.id = doc?.id
      return data;
    });

    return filteredData;
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
};

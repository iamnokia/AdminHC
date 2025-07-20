import { useState } from "react";
import axios from "axios";
import { Gender } from "../../../enums/gender";
import { Status } from "../../../enums/status";
import Swal from "sweetalert2";

export interface EmployeeModel {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  password: string;
  address: string;
  city: string;
  gender: Gender;
  cv: string;
  avatar: string;
  cat_id: string;
  cat_name: string;
  price: string;
  status: Status;
  created_at: string;
  updated_at: string;
}

export const useMainControllers = () => {
  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    tel: "+85620",
    password: "",
    address: "",
    gender: "",
    cv: "",
    avatar: null,
    cat_id: "",
    price: "",
    city: "",
  });

  // Form error state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Cities list
  const cities = [
    "CHANTHABULY",
    "SIKHOTTABONG",
    "XAYSETHA",
    "SISATTANAK",
    "NAXAITHONG",
    "XAYTANY",
    "HADXAIFONG",
  ];

  // Categories list
  const categories = [
    { id: "1", name: "ທຳຄວາມສະອາດ" },
    { id: "2", name: "ສ້ອມແປງໄຟຟ້າ" },
    { id: "3", name: "ສ້ອມແປງແອ" },
    { id: "4", name: "ສ້ອມແປງນ້ຳປະປາ" },
    { id: "5", name: "ແກ່ເຄື່ອງ" },
    { id: "6", name: "ດູດສ້ວມ" },
    { id: "7", name: "ກຳຈັດປວກ" },
  ];
// Village data organized by district
const addressByDistrict = {
  'CHANTHABULY': [
    { en: 'Anou', lo: 'ອານຸ' },
    { en: 'Bonangoua', lo: 'ບໍ່ນາງົງ' },
    { en: 'ChommanyKang', lo: 'ຈອມມະນີກາງ' },
    { en: 'ChommanyNeua', lo: 'ຈອມມະນີເໜືອ' },
    { en: 'Dondeng', lo: 'ດອນແດງ' },
    { en: 'Dongmiang', lo: 'ດົງໝ້ຽງ' },
    { en: 'HatsadeeTai', lo: 'ຫັດສະດີໃຕ້' },
    { en: 'HatsadyNeua', lo: 'ຫັດສະດີເໜືອ' },
    { en: 'Haysok', lo: 'ຫາຍໂສກ' },
    { en: 'Hongkaikeo', lo: 'ຮ່ອງໄກ່ແກ້ວ' },
    { en: 'HongkhaNeua', lo: 'ຮ່ອງຄ້າເໜືອ' },
    { en: 'HongkhaTai', lo: 'ຮ່ອງຄ້າໃຕ້' },
    { en: 'Hongxeng', lo: 'ຮ່ອງແຊງ' },
    { en: 'Houayhong', lo: 'ຫ້ວຍຫົງ' },
    { en: 'HoualouangTai', lo: 'ຂົວຫຼວງໃຕ້' },
    { en: 'Mixay', lo: 'ມີໄຊ' },
    { en: 'Nongping', lo: 'ໜອງປິງ' },
    { en: 'NongthaNeua', lo: 'ໜອງທາເໜືອ' },
    { en: 'NongthaTai', lo: 'ໜອງທາໃຕ້' },
    { en: 'Phonsavang', lo: 'ໂພນສະຫວ່າງ' },
    { en: 'PhonetongChommany', lo: 'ໂພນຕ້ອງຈອມມະນີ' },
    { en: 'PhonetongSawat', lo: 'ໂພນຕ້ອງສະຫວາດ' },
    { en: 'PhonetongSavang', lo: 'ໂພນຕ້ອງສະຫວ່າງ' },
    { en: 'Saylom', lo: 'ສາຍລົມ' },
    { en: 'Sibounheuang', lo: 'ສີບຸນເຮືອງ' },
    { en: 'Sidamdouane', lo: 'ສີດຳດວນ' },
    { en: 'Sihome', lo: 'ສີຫອມ' },
    { en: 'Sisaket', lo: 'ສີສະເກດ' },
    { en: 'SisavatKang', lo: 'ສີສະຫວາດກາງ' },
    { en: 'SisavatNeua', lo: 'ສີສະຫວາດເໜືອ' },
    { en: 'SisavatTai', lo: 'ສີສະຫວາດໃຕ້' },
    { en: 'ThongkhankhamNeua', lo: 'ທົ່ງຂັນຄຳເໜືອ' },
    { en: 'ThongkhankhamTai', lo: 'ທົ່ງຂັນຄຳໃຕ້' },
    { en: 'Thongsangnan', lo: 'ທົ່ງສ້າງນາງ' },
    { en: 'Thongtoum', lo: 'ທົ່ງຕູມ' },
    { en: 'Vatchan', lo: 'ວັດຈັນ' },
    { en: 'Xiengngeun', lo: 'ຊຽງຍືນ' }
  ],
  'SIKHOTTABONG': [
    { en: 'Akat', lo: 'ອາກາດ' },
    { en: 'Ang-Gnai', lo: 'ອ່າງໃຫຍ່' },
    { en: 'Champa', lo: 'ຈຳປາ' },
    { en: 'Chansavang', lo: 'ຈັນສະຫວ່າງ' },
    { en: 'Dankham', lo: 'ດ່ານຄຳ' },
    { en: 'Dongkalao', lo: 'ດົງກະເລົາ' },
    { en: 'Dongnathong', lo: 'ດົງນາທອງ' },
    { en: 'Dongnasok-Nuea', lo: 'ດົງນາໂຊກເໜືອ' },
    { en: 'Dongnasok-Tai', lo: 'ດົງນາໂຊກໃຕ້' },
    { en: 'Dongpalep', lo: 'ດົງປະແຫຼບ' },
    { en: 'Dongxingsou', lo: 'ດົງຊິງຊູ້' },
    { en: 'Houayhoam', lo: 'ຫ້ວຍຫ້ອມ' },
    { en: 'Kaoliao', lo: 'ເກົ້າລ້ຽວ' },
    { en: 'KhoualuangNuea', lo: 'ຂົວຫຼວງເໜືອ' },
    { en: 'KhountaTha', lo: 'ຂຸນຕາທ່າ' },
    { en: 'KhountaThong', lo: 'ຂຸນຕາທົ່ງ' },
    { en: 'Lakhin', lo: 'ຫຼັກຫຶນ' },
    { en: 'Mai', lo: 'ໃໝ່' },
    { en: 'MuangvaTha', lo: 'ເມືອງວາທ່າ' },
    { en: 'MuangvaThong', lo: 'ເມືອງວາທົ່ງ' },
    { en: 'Nahe', lo: 'ນາເຫ' },
    { en: 'Nakham', lo: 'ນາຄຳ' },
    { en: 'Nalao', lo: 'ນາເລົ່າ' },
    { en: 'NongbuathongNuea', lo: 'ໜອງບົວທອງເໜືອ' },
    { en: 'NongbuathongTai', lo: 'ໜອງບົວທອງໃຕ້' },
    { en: 'NongbukNuea', lo: 'ໜອງບຶກເໜືອ' },
    { en: 'NongbukTai', lo: 'ໜອງບຶກໃຕ້' },
    { en: 'Nongda', lo: 'ໜອງດາ' },
    { en: 'NongdouangNuea', lo: 'ໜອງດ້ວງເໜືອ' },
    { en: 'NongdouangTai', lo: 'ໜອງດ້ວງໃຕ້' },
    { en: 'NongdouangThong', lo: 'ໜອງດ້ວງທົ່ງ' },
    { en: 'Nongniao', lo: 'ໜອງໜ້ຽວ' },
    { en: 'Nongsanokham', lo: 'ໜອງສະໂນຄຳ' },
    { en: 'NongtengNuea', lo: 'ໜອງແຕ່ງເໜືອ' },
    { en: 'NongtengTai', lo: 'ໜອງແຕ່ງໃຕ້' },
    { en: 'Nonkeo', lo: 'ໂນນແກ້ວ' },
    { en: 'Nonkhilek', lo: 'ໂນນຂີ້ເຫຼັກ' },
    { en: 'Nonsavang', lo: 'ໂນນສະຫວ່າງ' },
    { en: 'Pakthang', lo: 'ປາກທ້າງ' },
    { en: 'Phonkham', lo: 'ໂພນຄຳ' },
    { en: 'PhonsavathNuea', lo: 'ໂພນສະຫວາດເໜືອ' },
    { en: 'PhonsavatTai', lo: 'ໂພນສະຫວາດໃຕ້' },
    { en: 'Phonsomboun', lo: 'ໂພນສົມບູນ' },
    { en: 'Phosi', lo: 'ໂພສີ' },
    { en: 'SibounhuangTha', lo: 'ສີບຸນເຮືອງທ່າ' },
    { en: 'SibounhuangThong', lo: 'ສີບຸນເຮືອງທົ່ງ' },
    { en: 'SikhaiTha', lo: 'ສີໄຄທ່າ' },
    { en: 'SikhaiThong', lo: 'ສີໄຄທົ່ງ' },
    { en: 'VattaingaiTha', lo: 'ວັດໄຕໃຫຍ່ທ່າ' },
    { en: 'Vattaingai-Thong', lo: 'ວັດໄຕໃຫຍ່ທົ່ງ' },
    { en: 'VattainoyTha', lo: 'ວັດໄຕນ້ອຍທ່າ' },
    { en: 'VattainoyThong', lo: 'ວັດໄຕນ້ອຍທົ່ງ' },
    { en: 'Viangkham', lo: 'ວຽງຄຳ' },
    { en: 'Viangsavan', lo: 'ວຽງສະຫວັນ' },
    { en: 'Xamket', lo: 'ຊຳເກດ' }
  ],
  // Add the rest of the districts following the same pattern...
  'XAYSETHA': [
    { en: 'Amon', lo: 'ອາມອນ' },
    { en: 'Chommani-Kang', lo: 'ຈອມມະນີກາງ' },
    { en: 'Chommani-Tai', lo: 'ຈອມມະນີໃຕ້' },
    { en: 'Chomsi', lo: 'ຈອມສີ' },
    { en: 'DoungGnai', lo: 'ດອນໄຫງ່' },
    { en: 'DoungKang', lo: 'ດອນກາງ' },
    { en: 'Fay', lo: 'ຝ້າຍ' },
    { en: 'Haikham', lo: 'ໄຫຄຳ' },
    { en: 'Honke', lo: 'ຮ່ອງແກ' },
    { en: 'Hongsouphap', lo: 'ຮ່ອງສູພາ' },
    { en: 'Huakhoua', lo: 'ຫົວຂົວ' },
    { en: 'Khamngoy', lo: 'ຄຳງອຍ' },
    { en: 'Khamsavat', lo: 'ຄຳສະຫວາດ' },
    { en: 'Muang-Noy', lo: 'ເມືອງນ້ອຍ' },
    { en: 'Nabian', lo: 'ນາບຽນ' },
    { en: 'Nahai', lo: 'ນາໄຫ' },
    { en: 'Nakhoy-Nua', lo: 'ນາຄວາຍເໜືອ' },
    { en: 'Nakhoay-Tai', lo: 'ນາຄວາຍໃຕ້' },
    { en: 'Nano', lo: 'ນາໂນ' },
    { en: 'Nasangphai', lo: 'ນາສັງໄຜ' },
    { en: 'Naxai', lo: 'ນາໄຊ' },
    { en: 'Nongbon', lo: 'ໜອງບອນ' },
    { en: 'Nongniang', lo: 'ໜອງໜ່ຽງ' },
    { en: 'Nongsangtho', lo: 'ໜອງສ້າງທໍ່' },
    { en: 'Nonkho-Nua', lo: 'ໂນນຄໍ້ເໜືອ' },
    { en: 'Nonkho-Tai', lo: 'ໂນນຄໍ້ໃຕ້' },
    { en: 'Nomsanga', lo: 'ໂນນສັງຫງ່າ' },
    { en: 'Nonsavan', lo: 'ໂນນສະຫວັນ' },
    { en: 'Nonsavang', lo: 'ໂນນສະຫວ່າງ' },
    { en: 'Nonvay', lo: 'ໂນນຫວາຍ' },
    { en: 'Phonkheng', lo: 'ໂພນເຄັງ' },
    { en: 'Phonphanao', lo: 'ໂພນພະເນົາ' },
    { en: 'Phonsa-At', lo: 'ໂພນສາອາດ' },
    { en: 'Phonthan-Nua', lo: 'ໂພນທັນເໜືອ' },
    { en: 'Phonthan-Tai', lo: 'ໂພນທັນໃຕ້' },
    { en: 'Phonthong', lo: 'ໂພນຕ້ອງ' },
    { en: 'Phonxai', lo: 'ໂພນໄຊ' },
    { en: 'Saphangmo', lo: 'ສະພາງໝໍ້' },
    { en: 'Sengsavang', lo: 'ແສງສະຫວ່າງ' },
    { en: 'Sisangvon', lo: 'ສີສັງວອນ' },
    { en: 'Somsanga', lo: 'ສົມສະຫງ່າ' },
    { en: 'ThalouangKang', lo: 'ທາດຫຼວງກາງ' },
    { en: 'ThalouangNua', lo: 'ທາດຫຼວງເໜືອ' },
    { en: 'ThatlouangTai', lo: 'ທາດຫຼວງໃຕ້' },
    { en: 'Vangxay', lo: 'ວັງຊາຍ' },
    { en: 'Viangchaleun', lo: 'ວຽງຈະເລີນ' },
    { en: 'Xamkhe', lo: 'ຊຳເຄ້' },
    { en: 'Xiangda', lo: 'ຊຽງດາ' },
    { en: 'XokGnai', lo: 'ໂຊກໃຫຍ່' },
    { en: 'Xokkham', lo: 'ໂຊກຄຳ' },
    { en: 'XokNoy', lo: 'ໂຊກນ້ອຍ' }
],
  'SISATTANAK': [
    { en: 'BungkhagnongNuea', lo: 'ບຶງຂະຫຍອງເໜືອ' },
    { en: 'BungkhagnongTai', lo: 'ບຶງຂະຫຍອງໃຕ້' },
    { en: 'Chomcheng', lo: 'ຈອມແຈ້ງ' },
    { en: 'ChomphetNuea', lo: 'ຈອມເພັດເໜືອ' },
    { en: 'ChomphetTai', lo: 'ຈອມເພັດໃຕ້' },
    { en: 'Donkoy', lo: 'ດອນກອຍ' },
    { en: 'Donnokkhoum', lo: 'ດອນນົກຂູ້ມ' },
    { en: 'DonpaMai', lo: 'ດອນປ່າໃໝ່' },
    { en: 'DongpalanTha', lo: 'ດົງປະລານທ່າ' },
    { en: 'DongpalanThong', lo: 'ດົງປະລານທົ່ງ' },
    { en: 'Dongsavat', lo: 'ດົງສະຫວາດ' },
    { en: 'Haysok', lo: 'ຫາຍໂສກ' },
    { en: 'Kaognot', lo: 'ເກົ້າຍອດ' },
    { en: 'Khoknin', lo: 'ໂຄກນິນ' },
    { en: 'Nongchan', lo: 'ໜອງຈັນ' },
    { en: 'Phapho', lo: 'ພະໂພ' },
    { en: 'Phaxai', lo: 'ພະໄຊ' },
    { en: 'Phiavat', lo: 'ເພຍວັດ' },
    { en: 'PhonpapaTha', lo: 'ໂພນປາເປົ້າທ່າ' },
    { en: 'PhonpapaoThong', lo: 'ໂພນປາເປົ້າທົ່ງ' },
    { en: 'Phonsavang', lo: 'ໂພນສະຫວ່າງ' },
    { en: 'PhonsavanNuea', lo: 'ໂພນສະຫວັນເໜືອ' },
    { en: 'PhonsavanTai', lo: 'ໂພນສະຫວັນໃຕ້' },
    { en: 'Phonsinouan', lo: 'ໂພນສີນວນ' },
    { en: 'Phosai', lo: 'ໂພໄຊ' },
    { en: 'Sangveuy', lo: 'ສ້າງເຫວີຍ' },
    { en: 'SaphanthongKang', lo: 'ສະພານທອງກາງ' },
    { en: 'SaphanthonNuea', lo: 'ສະພານທອງເໜືອ' },
    { en: 'Simuang', lo: 'ສີເມືອງ' },
    { en: 'Sokpalouang', lo: 'ໂສກປະຫຼວງ' },
    { en: 'Souamon', lo: 'ສວນມອນ' },
    { en: 'Thapalanxai', lo: 'ທ່າພະລານໄຊ' },
    { en: 'Thatkhao', lo: 'ທາດຂາວ' },
    { en: 'Thong-Kang', lo: 'ທົ່ງກາງ' },
    { en: 'Thongphanthong', lo: 'ທົ່ງພານທອງ' },
    { en: 'Vatnak', lo: 'ວັດນາກ' },
    { en: 'Vatsao', lo: 'ວັດເສົາ' },
    { en: 'Xaisathan', lo: 'ໄຊສະຖານ' }
],
'NAXAITHONG': [
    { en: 'Boua', lo: 'ບົວ' },
    { en: 'Chengsavang', lo: 'ຈັນສະຫວ່າງ' },
    { en: 'Dongbong', lo: 'ນາບົງ' },
    { en: 'Dongxiangdi', lo: 'ດົງຊຽງດີ' },
    { en: 'Houakhoua', lo: 'ຫົວຂົວ' },
    { en: 'Nadi', lo: 'ນາດີ' },
    { en: 'NakhounNua', lo: 'ນາຄູນເໜືອ' },
    { en: 'NakhounTai', lo: 'ນາຄູນໃຕ້' },
    { en: 'NaxaythongKang', lo: 'ນາຊາຍທອງກາງ' },
    { en: 'NaxaythongNuea', lo: 'ນາຊາຍທອງເໜືອ' },
    { en: 'NaxaythongTai', lo: 'ນາຊາຍທອງໃຕ້' },
    { en: 'Naxon', lo: 'ນາຊອນ' },
    { en: 'Nongsa', lo: 'ໜອງສະ' },
    { en: 'Sikeut', lo: 'ສີເກີດ' },
    { en: 'Xaimoungkhount', lo: 'ໄຊມຸງຄຸນ' }
],
  'XAYTANY': [
    { en: 'Hai', lo: 'ໄຮ່' },
    { en: 'Dansang', lo: 'ດ່ານຊ້າງ' },
    { en: 'Dongdok', lo: 'ດົງໂດກ' },
    { en: 'Dongmakkhaiy', lo: 'ດົງໝາກຄານຍ' },
    { en: 'Donnoun', lo: 'ດອນໜູນ' },
    { en: 'Donsanghin', lo: 'ດົງສ້າງຫິນ' },
    { en: 'Dontiw', lo: 'ດອນຕິ້ວ' },
    { en: 'Hatkieng', lo: 'ຫາດກ້ຽງ' },
    { en: 'Houana', lo: 'ຫົວນາ' },
    { en: 'Houakhua', lo: 'ຫົວຂົວ' },
    { en: 'Houaxiang', lo: 'ຫົວຊຽງ' },
    { en: 'Houaytoei', lo: 'ຫ້ວຍເຕີຍ' },
    { en: 'Houaydaenmueang', lo: 'ຫ້ວຍແດນເມືອງ' },
    { en: 'Kaengkhai', lo: 'ແກ້ງໄຄ້' },
    { en: 'Khamhoung', lo: 'ຄຳຮຸ່ງ' },
    { en: 'Khoksivilai', lo: 'ໂຄກສິວິໄລ' },
    { en: 'Khoudsambard', lo: 'ຂຸດສາມບາດ' },
    { en: 'Lardkhuay', lo: 'ລາດຄວາຍ' },
    { en: 'Nakae', lo: 'ນາແຄ' },
    { en: 'Nakoung', lo: 'ນາກຸງ' },
    { en: 'Nakhanthong', lo: 'ນາຄັນທຸງ' },
    { en: 'Nasiew', lo: 'ນາສ້ຽງ' },
    { en: 'Nathae', lo: 'ນາແຖ' },
    { en: 'Nathom', lo: 'ນາທົ່ມ' },
    { en: 'Nonbokeo', lo: 'ໂນນບໍ່ແກ້ວ' },
    { en: 'Nongphaya', lo: 'ໜອງພະຍາ' },
    { en: 'Nongsonghong', lo: 'ໜອງສອງຫ້ອງ' },
    { en: 'Nongviengkham', lo: 'ໜອງວຽງຄຳ' },
    { en: 'Nonsaart', lo: 'ໂນນສະອາດ' },
    { en: 'Nonthong', lo: 'ນາທອງ' },
    { en: 'Oudomphon', lo: 'ອຸດົມຜົນ' },
    { en: 'Phakhao', lo: 'ພະຂາວ' },
    { en: 'Phonhaikham', lo: 'ໂພນໄຮຄຳ' },
    { en: 'Phonngamnueng', lo: 'ໂພນງາມ 1' },
    { en: 'Phonngamsong', lo: 'ໂພນງາມ 2' },
    { en: 'Phoukham', lo: 'ພູຄຳ' },
    { en: 'SaiNamNgern', lo: 'ສາຍນ້ຳເງິນ' },
    { en: 'Sangkhou', lo: 'ຊ້າງຄູ້' },
    { en: 'Saphangmuek', lo: 'ສະພັງເມິກ' },
    { en: 'Sivilai', lo: 'ສີວິໄລ' },
    { en: 'Tarnmixay', lo: 'ຕານມີໄຊ' },
    { en: 'ThadingdaengNeua', lo: 'ທ່າດິນແດງເໜືອ' },
    { en: 'ThadingdaengTai', lo: 'ທ່າດິນແດງໃຕ້' },
    { en: 'Thadindaeng', lo: 'ທ່າດິນແດງ' },
    { en: 'Thangon', lo: 'ທ່າງ່ອນ' },
    { en: 'Thasavang', lo: 'ທ່າສະຫວ່າງ' }
],
  'HADXAIFONG': [
    { en: 'BoO', lo: 'ບໍ່ໂອ' },
    { en: 'Chomthong', lo: 'ຈອມທອງ' },
    { en: 'Chienaimo', lo: 'ຈີ່ນາຍໂມ້' },
    { en: 'Dondou', lo: 'ດອນດູ່' },
    { en: 'Dongkhamxang', lo: 'ດົງຄຳຊ້າງ' },
    { en: 'Dongphonehe', lo: 'ດົງໂພນແຮ່' },
    { en: 'Dongphonlao', lo: 'ດົງໂພນເລົາ' },
    { en: 'Dongphosi', lo: 'ດົງໂພສີ' },
    { en: 'Donkeut', lo: 'ດອນເກີດ' },
    { en: 'Donkhaxay', lo: 'ດອນຂາຊ້າຍ' },
    { en: 'Hatdonkeo', lo: 'ຫາດດອນແກ້ວ' },
    { en: 'Hatxaykhao', lo: 'ຫາດຊາຍຂາວ' },
    { en: 'HomTai', lo: 'ຫ້ອມໃຕ້' },
    { en: 'Homnuea', lo: 'ຫ້ອມເໜືອ' },
    { en: 'Kang', lo: 'ກາງ' },
    { en: 'Nahai', lo: 'ນາໄຫ' },
    { en: 'Nonghai', lo: 'ໜອງໄຮ' },
    { en: 'Nongheo', lo: 'ໜອງແຫ້ວ' },
    { en: 'Nongveng', lo: 'ໜອງແວງ' },
    { en: 'Pava', lo: 'ປ່າຫວ້າ' },
    { en: 'Phao', lo: 'ພ້າວ' },
    { en: 'SalakhamNuea', lo: 'ສາລາຄຳເໜືອ' },
    { en: 'SalakhamTai', lo: 'ສາລສຄຳໃຕ້' },
    { en: 'SomvangNuea', lo: 'ສົມຫວັງເໜືອ' },
    { en: 'SomvangTai', lo: 'ສົມຫວັງໃຕ້' },
    { en: 'Thadua', lo: 'ທ່າເດື່ອ' },
    { en: 'Thamouang', lo: 'ທ່າມ່ວງ' },
    { en: 'Thana', lo: 'ທ່ານາ' },
    { en: 'Thanaleng', lo: 'ທ່ານາແລ້ງ' },
    { en: 'Thinphia', lo: 'ຖິ້ນເພຍ' },
    { en: 'Thintom', lo: 'ຖິ່ນຕົມ' },
    { en: 'Xiangkhouan', lo: 'ຊຽງຄວນ' }
]
};

  // Handle input change
const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If city changes, reset address
    if (name === 'city') {
        setFormData({ ...formData, [name]: value, address: '' });
    } else {
        setFormData({ ...formData, [name]: value });
    }

    // Clear error for this field if it exists
    if (errors[name]) {
        setErrors({ ...errors, [name]: null });
    }
    
    // Clear address error when city changes
    if (name === 'city' && errors.address) {
        setErrors({ ...errors, [name]: null, address: null });
    }
};

  // Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });

      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
    }
  };

  // Enhanced validation function
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Required fields validation
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "tel",
      "password",
      "gender",
      "address",
      "cat_id",
      "city",
      "price",
      "cv",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
        isValid = false;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation - very important
    if (formData.tel) {
      const cleanedTel = formData.tel.replace(/\s/g, "");
      if (!/^\+85620\d{8}$/.test(cleanedTel)) {
        newErrors.tel = "Please enter a valid phone number with 8 digits after +85620";
        isValid = false;
      }
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Price validation
    if (formData.price) {
      const price = parseInt(formData.price, 10);
      if (isNaN(price) || price <= 0) {
        newErrors.price = "Please enter a valid price amount";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Check if form is valid (used for enabling/disabling submit button)
  const isFormValid = () => {
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "tel",
      "password",
      "gender",
      "address",
      "cat_id",
      "city",
      "price",
      "cv",
    ];

    return requiredFields.every((field) => !!formData[field]) && 
           formData.tel.length >= 13; // +85620 (6 chars) + 8 digits = 14 chars (or more with spaces)
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation and stop if invalid
    if (!validateForm()) {
      // Show validation error alert
      Swal.fire({
        title: "ຂໍ້ຜິດພາດ!",
        text: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ ແລະ ຖືກຕ້ອງ",
        icon: "error",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#611463"
      });
      return;
    }

    // Show loading alert
    Swal.fire({
      title: "ກຳລັງບັນທຶກຂໍ້ມູນ",
      text: "ກະລຸນາລໍຖ້າ...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setIsSubmitting(true);

    try {
      // Find category name based on cat_id
      const selectedCategory = categories.find(cat => cat.id === formData.cat_id);
      const categoryName = selectedCategory ? selectedCategory.name : "";

      // Clean form data - remove whitespace and format properly
      const cleanedFormData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        tel: formData.tel.replace(/\s/g, ""), // Remove any spaces
        password: formData.password,
        address: formData.address.trim(),
        gender: formData.gender,
        cv: formData.cv.trim(),
        cat_id: formData.cat_id,
        cat_name: categoryName,
        price: formData.price,
        city: formData.city,
        status: Status.ACTIVE
      };

      let response;

      if (formData.avatar) {
        // If we have an image, use FormData approach
        const submitData = new FormData();
        
        // Add all text fields to FormData
        Object.entries(cleanedFormData).forEach(([key, value]) => {
          submitData.append(key, value);
        });
        
        // Add file last
        submitData.append('avatar', formData.avatar);

        // Log what we're sending for debugging
        console.log("Submitting form with image", {
          method: "POST",
          url: "https://homecare-pro.onrender.com/employees/create_employees",
          contentType: "multipart/form-data",
          data: Object.fromEntries(submitData.entries())
        });

        // Send with multipart/form-data
        response = await axios.post(
          "https://homecare-pro.onrender.com/employees/create_employees",
          submitData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            timeout: 15000 // Set a reasonable timeout
          }
        );
      } else {
        // If no image, use regular JSON submission
        // Log what we're sending for debugging
        console.log("Submitting form without image", {
          method: "POST",
          url: "https://homecare-pro.onrender.com/employees/create_employees",
          contentType: "application/json",
          data: cleanedFormData
        });

        // Send as JSON
        response = await axios.post(
          "https://homecare-pro.onrender.com/employees/create_employees",
          cleanedFormData,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 15000 // Set a reasonable timeout
          }
        );
      }

      console.log("API Response:", response.data);
      setSubmitSuccess(true);

      // Show success alert
      Swal.fire({
        title: "ສຳເລັດ!",
        text: "ບັນທຶກຂໍ້ມູນພະນັກງານສຳເລັດແລ້ວ",
        icon: "success",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#611463"
      });

      // Reset form after successful submission
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        tel: "+85620",
        password: "",
        address: "",
        gender: "",
        cv: "",
        avatar: null,
        cat_id: "",
        price: "",
        city: "",
      });

    } catch (error) {
      console.error("Error creating employee:", error);
      
      // Detailed error logging for debugging
      console.error("API Error Details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });

      // Determine error message
      let errorMessage = "ເກີດຂໍ້ຜິດພາດ. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.";

      // Handle API error responses
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string' && error.response.data.includes('Internal Server Error')) {
          errorMessage = "ເກີດຂໍ້ຜິດພາດທາງເຊີບເວີ. ກະລຸນາລອງໃໝ່ອີກຄັ້ງຫຼັງຈາກ.";
        }
      }

      // Show error alert
      Swal.fire({
        title: "ຂໍ້ຜິດພາດ!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#611463"
      });

      // Set errors state for form validation
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setErrors({ general: error.response.data.message || "An error occurred" });
        }
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleFileChange,
    handleSubmit,
    isFormValid,
    validateForm,
    cities,
    categories,
    errors,
    isSubmitting,
    submitSuccess,
    addressByDistrict
  };
};

export default useMainControllers;
/**
 * Authoritative DGIPR 9-Division Configuration.
 * Single data-driven configuration driving the DIPR panel dropdown menus.
 * Changing division headings or metadata here updates the UI immediately.
 */

export interface DIPRDistrictConfig {
  code: string;
  id: string;
  nameEn: string;
  nameMr: string;
  dioName: string;
  dioPhone: string;
}

export interface DIPRDivisionConfig {
  key: string;
  code: string;
  nameEn: string;
  nameMr: string;
  hqDistrictCode: string;
  officeNameMr: string;
  districts: DIPRDistrictConfig[];
}

export const DIPR_DIVISIONS_CONFIG: DIPRDivisionConfig[] = [
  {
    key: 'mumbai',
    code: 'DIV-MUM',
    nameEn: 'Mumbai',
    nameMr: 'मुंबई',
    hqDistrictCode: 'MH-01',
    officeNameMr: 'विभागीय माहिती कार्यालय मुंबई',
    districts: [
      { code: 'MH-01', id: 'mumbai-city', nameEn: 'Mumbai City', nameMr: 'मुंबई शहर', dioName: 'Sachin D. Mane', dioPhone: '+91 22 2202 4110' },
      { code: 'MH-02', id: 'mumbai-suburban', nameEn: 'Mumbai Suburban', nameMr: 'मुंबई उपनगर', dioName: 'Pooja V. Shinde', dioPhone: '+91 22 2202 4120' },
    ],
  },
  {
    key: 'konkan',
    code: 'DIV-KON',
    nameEn: 'Konkan',
    nameMr: 'कोकण',
    hqDistrictCode: 'MH-04',
    officeNameMr: 'विभागीय माहिती कार्यालय कोकण',
    districts: [
      { code: 'MH-03', id: 'palghar', nameEn: 'Palghar', nameMr: 'पालघर', dioName: 'Sunil B. Thorat', dioPhone: '+91 25 2525 1100' },
      { code: 'MH-04', id: 'thane', nameEn: 'Thane', nameMr: 'ठाणे', dioName: 'Dr. Ramesh S. Kulkarni', dioPhone: '+91 22 2534 4000' },
      { code: 'MH-05', id: 'raigad', nameEn: 'Raigad', nameMr: 'रायगड', dioName: 'Anand R. Patil', dioPhone: '+91 21 4122 2000' },
      { code: 'MH-06', id: 'ratnagiri', nameEn: 'Ratnagiri', nameMr: 'रत्नागिरी', dioName: 'Snehal M. Kadam', dioPhone: '+91 23 5222 3000' },
    ],
  },
  {
    key: 'pune',
    code: 'DIV-PUN',
    nameEn: 'Pune',
    nameMr: 'पुणे',
    hqDistrictCode: 'MH-07',
    officeNameMr: 'पुणे विभागीय माहिती कार्यालय',
    districts: [
      { code: 'MH-07', id: 'pune', nameEn: 'Pune', nameMr: 'पुणे', dioName: 'Vikram S. Deshmukh', dioPhone: '+91 20 2612 5000' },
      { code: 'MH-08', id: 'satara', nameEn: 'Satara', nameMr: 'सातारा', dioName: 'Anita P. Bhosale', dioPhone: '+91 21 6223 4000' },
      { code: 'MH-09', id: 'solapur', nameEn: 'Solapur', nameMr: 'सोलापूर', dioName: 'Prakash K. Chavan', dioPhone: '+91 21 7272 6000' },
    ],
  },
  {
    key: 'kolhapur',
    code: 'DIV-KOL',
    nameEn: 'Kolhapur',
    nameMr: 'कोल्हापूर',
    hqDistrictCode: 'MH-10',
    officeNameMr: 'कोल्हापूर विभागीय माहिती कार्यालय',
    districts: [
      { code: 'MH-10', id: 'kolhapur', nameEn: 'Kolhapur', nameMr: 'कोल्हापूर', dioName: 'Rajesh V. Shinde', dioPhone: '+91 23 1265 1000' },
      { code: 'MH-11', id: 'sangli', nameEn: 'Sangli', nameMr: 'सांगली', dioName: 'Swati R. Salunkhe', dioPhone: '+91 23 3237 3000' },
      { code: 'MH-12', id: 'sindhudurg', nameEn: 'Sindhudurg', nameMr: 'सिंधुदुर्ग', dioName: 'Dattatray N. More', dioPhone: '+91 23 6222 8000' },
    ],
  },
  {
    key: 'latur',
    code: 'DIV-LAT',
    nameEn: 'Latur',
    nameMr: 'लातूर',
    hqDistrictCode: 'MH-13',
    officeNameMr: 'लातूर विभागीय माहिती कार्यालय',
    districts: [
      { code: 'MH-13', id: 'latur', nameEn: 'Latur', nameMr: 'लातूर', dioName: 'Sanjay M. Gaikwad', dioPhone: '+91 23 8224 5000' },
      { code: 'MH-14', id: 'dharashiv', nameEn: 'Dharashiv', nameMr: 'धाराशिव', dioName: 'Meena K. Pawar', dioPhone: '+91 24 7222 2000' },
      { code: 'MH-15', id: 'nanded', nameEn: 'Nanded', nameMr: 'नांदेड', dioName: 'Ashok S. Jadhav', dioPhone: '+91 24 6223 7000' },
      { code: 'MH-16', id: 'hingoli', nameEn: 'Hingoli', nameMr: 'हिंगोली', dioName: 'Pradeep B. Wagh', dioPhone: '+91 24 5622 1000' },
    ],
  },
  {
    key: 'chhatrapati-sambhajinagar',
    code: 'DIV-CSN',
    nameEn: 'Chhatrapati Sambhajinagar',
    nameMr: 'छत्रपती संभाजीनगर',
    hqDistrictCode: 'MH-17',
    officeNameMr: 'छत्रपती संभाजीनगर विभागीय माहिती कार्यालय',
    districts: [
      { code: 'MH-17', id: 'chhatrapati-sambhajinagar', nameEn: 'Chhatrapati Sambhajinagar', nameMr: 'छत्रपती संभाजीनगर', dioName: 'Ganesh P. Deshmukh', dioPhone: '+91 24 0233 4000' },
      { code: 'MH-18', id: 'jalna', nameEn: 'Jalna', nameMr: 'जालना', dioName: 'Kavita S. Patil', dioPhone: '+91 24 8222 5000' },
      { code: 'MH-19', id: 'parbhani', nameEn: 'Parbhani', nameMr: 'परभणी', dioName: 'Nitin R. Kadam', dioPhone: '+91 24 5222 3000' },
      { code: 'MH-20', id: 'beed', nameEn: 'Beed', nameMr: 'बीड', dioName: 'Archana V. More', dioPhone: '+91 24 4222 2000' },
    ],
  },
  {
    key: 'nashik',
    code: 'DIV-NSK',
    nameEn: 'Nashik',
    nameMr: 'नाशिक',
    hqDistrictCode: 'MH-21',
    officeNameMr: 'नाशिक विभागीय माहिती कार्यालय',
    districts: [
      { code: 'MH-21', id: 'nashik', nameEn: 'Nashik', nameMr: 'नाशिक', dioName: 'Mahesh K. Shinde', dioPhone: '+91 25 3257 6000' },
      { code: 'MH-22', id: 'jalgaon', nameEn: 'Jalgaon', nameMr: 'जळगाव', dioName: 'Shilpa D. Thorat', dioPhone: '+91 25 7222 4000' },
      { code: 'MH-23', id: 'dhule', nameEn: 'Dhule', nameMr: 'धुळे', dioName: 'Hemant S. Kulkarni', dioPhone: '+91 25 6228 8000' },
      { code: 'MH-24', id: 'nandurbar', nameEn: 'Nandurbar', nameMr: 'नंदुरबार', dioName: 'Deepali B. Salunkhe', dioPhone: '+91 25 6422 2000' },
      { code: 'MH-25', id: 'ahilyanagar', nameEn: 'Ahilyanagar', nameMr: 'अहिल्यानगर', dioName: 'Sunita M. Bhosale', dioPhone: '+91 24 1234 5000' },
    ],
  },
  {
    key: 'amravati',
    code: 'DIV-AMT',
    nameEn: 'Amravati',
    nameMr: 'अमरावती',
    hqDistrictCode: 'MH-26',
    officeNameMr: 'अमरावती विभागीय माहिती कार्यालय',
    districts: [
      { code: 'MH-26', id: 'amravati', nameEn: 'Amravati', nameMr: 'अमरावती', dioName: 'Vijay N. Deshpande', dioPhone: '+91 72 1266 2000' },
      { code: 'MH-27', id: 'buldhana', nameEn: 'Buldhana', nameMr: 'बुलढाणा', dioName: 'Neeta P. Chavan', dioPhone: '+91 72 6224 2000' },
      { code: 'MH-28', id: 'washim', nameEn: 'Washim', nameMr: 'वाशीम', dioName: 'Suresh R. Gaikwad', dioPhone: '+91 72 5223 2000' },
      { code: 'MH-29', id: 'yavatmal', nameEn: 'Yavatmal', nameMr: 'यवतमाळ', dioName: 'Manasi S. Mane', dioPhone: '+91 72 3224 3000' },
      { code: 'MH-30', id: 'akola', nameEn: 'Akola', nameMr: 'अकोला', dioName: 'Pradnya K. Wagh', dioPhone: '+91 72 4243 4000' },
    ],
  },
  {
    key: 'nagpur',
    code: 'DIV-NGP',
    nameEn: 'Nagpur',
    nameMr: 'नागपूर',
    hqDistrictCode: 'MH-31',
    officeNameMr: 'नागपूर विभागीय माहिती कार्यालय',
    districts: [
      { code: 'MH-31', id: 'nagpur', nameEn: 'Nagpur', nameMr: 'नागपूर', dioName: 'Nitin S. Deshmukh', dioPhone: '+91 71 2256 1000' },
      { code: 'MH-32', id: 'wardha', nameEn: 'Wardha', nameMr: 'वर्धा', dioName: 'Supriya A. Patil', dioPhone: '+91 71 5224 4000' },
      { code: 'MH-33', id: 'bhandara', nameEn: 'Bhandara', nameMr: 'भंडारा', dioName: 'Ramesh V. Jadhav', dioPhone: '+91 71 8425 2000' },
      { code: 'MH-34', id: 'gondia', nameEn: 'Gondia', nameMr: 'गोंदिया', dioName: 'Vidya M. Kadam', dioPhone: '+91 71 8223 6000' },
      { code: 'MH-35', id: 'gadchiroli', nameEn: 'Gadchiroli', nameMr: 'गडचिरोली', dioName: 'Anand K. Shinde', dioPhone: '+91 71 3222 2000' },
      { code: 'MH-36', id: 'chandrapur', nameEn: 'Chandrapur', nameMr: 'चंद्रपूर', dioName: 'Snehal S. Thorat', dioPhone: '+91 71 7225 5000' },
    ],
  },
];

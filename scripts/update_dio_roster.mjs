import fs from 'fs';

const path = 'src/data/maharashtraDistrictsData.ts';
let code = fs.readFileSync(path, 'utf8');

const updates = {
  'thane': { officer: 'Manoj Sanap', officerMr: 'मनोज सानप' },
  'raigad': { officer: 'Manoj Sanap', officerMr: 'मनोज सानप' },
  'palghar': { officer: 'Rahul Bhalerao', officerMr: 'राहुल भालेराव' },
  'ratnagiri': { officer: 'Prashant Satpute', officerMr: 'प्रशांत सातपुते' },
  'sindhudurg': { officer: 'Sachin Adsul', officerMr: 'सचिन अडसूळ' },
  'kolhapur': { officer: 'Varsha Patole', officerMr: 'वर्षा पाटोळे' },
  'sangli': { officer: 'Saprada Bidkar', officerMr: 'संप्रदा बिडकर' },
  'pune': { officer: 'Yuvraj Patil', officerMr: 'युवराज पाटील' },
  'solapur': { officer: 'Sunil Suntake', officerMr: 'सुनील सोनटक्के' },
  'satara': { officer: 'Dr. Kiran Moghe', officerMr: 'डॉ. किरण मोघे' },
  'nashik': { officer: 'Vilash Bodkhe', officerMr: 'विलास बोडके' },
  'dhule': { officer: 'Ranjeetsingh Rajput', officerMr: 'रणजितसिंह राजपूत' },
  'jalgaon': { officer: 'Ravindra Thakur', officerMr: 'रवींद्र ठाकूर' },
  'ahilyanagar': { officer: 'Mukund Chinvant', officerMr: 'मुकुंद चिनवंत' },
  'nandurbar': { officer: 'Gopal Salunkhe', officerMr: 'गोपाळ साळुंखे' },
  'chhatrapati-sambhajinagar': { officer: 'Dr. Milind Dusane', officerMr: 'डॉ. मिलिंद दुसाने' },
  'jalna': { officer: 'Arun Suryavanshi', officerMr: 'अरुण सूर्यवंशी' },
  'parbhani': { officer: 'Pramod Dhongade', officerMr: 'प्रमोद धोंगडे' },
  'beed': { officer: 'Prashant Deithankar', officerMr: 'प्रशांत दैठणकर' },
  'latur': { officer: 'Tanaji Gholap', officerMr: 'तानाजी घोलप' },
  'dharashiv': { officer: 'Vivek Khade', officerMr: 'विवेक खाडे' },
  'nanded': { officer: 'Pramod Dhongade', officerMr: 'प्रमोद धोंगडे' },
  'hingoli': { officer: 'Sham Tarke', officerMr: 'शाम तरके' },
  'amravati': { officer: 'Gajanan Poturwar', officerMr: 'गजानन पोतूरवार' },
  'buldhana': { officer: 'Arun Suryavanshi', officerMr: 'अरुण सूर्यवंशी' },
  'yavatmal': { officer: 'Pawan Rathod', officerMr: 'पवन राठोड' },
  'washim': { officer: 'Jayesh Khandare', officerMr: 'जयेश खंदारे' },
  'akola': { officer: 'Harshwardhan Pawar', officerMr: 'हर्षवर्धन पवार' },
  'nagpur': { officer: 'Pallavi Dharav', officerMr: 'पल्लवी ढवळे' },
  'gadchiroli': { officer: 'Gajanan Jadhav', officerMr: 'गजानन जाधव' },
  'gondia': { officer: 'Anju Kamble', officerMr: 'अंजू कांबळे' },
  'wardha': { officer: 'Mangesh Warkad', officerMr: 'मंगेश वरकड' },
  'bhandara': { officer: 'Shailaja Waghdandale', officerMr: 'शैलजा वाघदांडगे' },
  'chandrapur': { officer: 'Ganesh Mule', officerMr: 'गणेश मुळे' },
  'mumbai-city': { officer: 'Varsha Andhale', officerMr: 'वर्षा आंधळे' },
  'mumbai-suburban': { officer: 'Dr. Kishor Gangurde', officerMr: 'डॉ. किशोर गांगुर्डे' }
};

let count = 0;
for (const [id, info] of Object.entries(updates)) {
  const pattern = new RegExp(`(id:\\s*'${id}',[\\s\\S]*?dioOffice:\\s*\\{[\\s\\S]*?officer:\\s*)'[^']+'([\\s\\S]*?officerMr:\\s*)'[^']+'`);
  if (pattern.test(code)) {
    code = code.replace(pattern, `$1'${info.officer}'$2'${info.officerMr}'`);
    count++;
  } else {
    console.error(`Pattern not matched for ${id}`);
  }
}

fs.writeFileSync(path, code, 'utf8');
console.log(`Updated ${count} districts in ${path}`);


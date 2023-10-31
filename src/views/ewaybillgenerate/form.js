// ** React Imports
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, Fragment } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { User, Check, X } from 'react-feather'
import { selectThemeColors } from '@utils'
import Swal from 'sweetalert2';
import axios from 'axios';
import toast from 'react-hot-toast';
import { local_api_assets_url } from '@src/common/Helpers'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Button, Input, Row, Col, Card } from 'reactstrap'

// ** Store & Actions
import { getData } from './store'
import { useDispatch, useSelector } from 'react-redux'

// ** Styles
import '@styles/react/apps/app-invoice.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
// ** Custom Components
import Avatar from '@components/avatar'
// ** Reactstrap Imports
import {
  Modal,
  ListGroup,
  ListGroupItem,
  Label,
  CardBody,
  CardText,
  CardTitle,
  ModalBody,
  ModalHeader,
  FormFeedback,
  CardHeader,
  UncontrolledTooltip
} from 'reactstrap'
// ** Third Party Components
import {
  Eye,
  Send,
  Edit,
  Copy,
  Save,
  Info,
  Trash,
  PieChart,
  Download,
  TrendingUp,
  CheckCircle,
  MoreVertical,
  ArrowDownCircle
} from 'react-feather'
// ** Vars
const invoiceStatusObj = {
  Sent: { color: 'light-secondary', icon: Send },
  Paid: { color: 'light-success', icon: CheckCircle },
  Draft: { color: 'light-primary', icon: Save },
  Downloaded: { color: 'light-info', icon: ArrowDownCircle },
  'Past Due': { color: 'light-danger', icon: Info },
  'Partial Payment': { color: 'light-warning', icon: PieChart }
}
// import { Card, , CardTitle, CardBody, Button, ListGroup, ListGroupItem } from 'reactstrap'
import { useDropzone } from 'react-dropzone'
import { FileText, DownloadCloud } from 'react-feather'
import { api_url } from '@src/common/Helpers'
import { local_api_url } from '@src/common/Helpers'

const InvoiceList = () => {
  const [defaultValues, setdefaultValues] = useState({ categoryid: '', categoryname: '', categoryimage: '' });
  const CustomHeader = ({ value, handlePerPage, rowsPerPage }) => {
    //formcode
    const [id, setid] = useState();
    const [categoryname, setcategoryname] = useState();
    const [categoryimage, setcategoryimage] = useState();
    const [partyname, setpartyname] = useState();
    const [partyaadharnumber, setpartyaadharnumber] = useState();
    const [partyphonenumber, setpartyphonenumber] = useState();
    const [partyaddress, setpartyaddress] = useState();
    const [remarks, setremarks] = useState();
    const [partyaccountnumber, setpartyaccountnumber] = useState([]);
    const [partyifsccode, setpartyifsccode] = useState([]);
    const accountDetails = [];
    accountDetails.push({
      accountNumber: partyaccountnumber,
      ifscCode: partyifsccode,
    });
    const onsubmit = (e) => {
      e.preventDefault();
      const formdata = new FormData();
      formdata.append('id', id);
      formdata.append('name', partyname);
      formdata.append('aadhar_no', partyaadharnumber);
      formdata.append('phone_number', partyphonenumber);
      formdata.append('address', partyaddress);
      formdata.append('remark', remarks);
      formdata.append('accountdetails', JSON.stringify(accountDetails));
      fetch(local_api_url + 'supplier_form_store', {
        method: 'POST',
        body: formdata,
      })
        .then(response => response.json())
        .then(data => {
          // Check if the upload was successful based on your API response
          if (data) {
            // Display a success toast that auto-closes after 3 seconds
            toast.success('Updated successfully', {
              duration: 3000, // 3000 milliseconds (3 seconds)
            });
            fetchData();
          } else {
            // Display an error toast if the API response indicates an error
            toast.error('Upload failed');
          }
        })
        .catch(error => {
          // Display an error toast for network errors or other issues
          toast.error('Upload error: ' + error.message);
          console.error('Upload error:', error);
        });
    };

   
    return (
      <div className='invoice-list-table-header w-100 py-2'>
        <Row>
          <Col lg='6' className='d-flex align-items-center px-0 px-lg-1'>
            <div className='d-flex align-items-center me-2'>
              <label htmlFor='rows-per-page'>Show</label>
              <Input
                type='select'
                id='rows-per-page'
                value={rowsPerPage}
                onChange={handlePerPage}
                className='form-control ms-50 pe-3'
              >
                <option value='10'>10</option>
                <option value='25'>25</option>
                <option value='50'>50</option>
                <option value='100'>100</option>
              </Input>
            </div>

          </Col>
          <Col
            lg='6'
            className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0'
          >
            <div className='d-flex align-items-center'>
              <label htmlFor='search-invoice'>Search</label>
              <Input
                id='search-invoice'
                className='ms-50 me-2 w-100'
                type='text'
                value={searchkey}
                onChange={e => handleFilter(e.target.value)}
                placeholder='Search Invoice'
              />
            </div>

          </Col>
          

        </Row>
      </div>
    )
    function handleInputChange(index, field, value) {
      const updatedInputSets = [...inputSets];
      updatedInputSets[index][field] = value;
      setInputSets(updatedInputSets);
    }
  }
  // ** States
  const [show, setShow] = useState(false)
  const [infoshow, setInfoshow] = useState(false)
  const [value, setValue] = useState('');
  const [sort, setSort] = useState('desc');
  const [sortColumn, setSortColumn] = useState('id');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fetchedData, setFetchedData] = useState([]); // New state to hold fetched data
  const fetchData = async () => {
    try {
      const response = await fetch(local_api_url + 'supplier_form_list', {
        method: 'GET',
        // You can add headers if needed
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setFetchedData(data); // Update the fetched data state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [value, sort, sortColumn, currentPage, rowsPerPage, statusValue]);
  const [searchkey, setsearchkey] = useState('');
  const handleFilter = val => {
    setsearchkey(val);
    // Fetch data here or adjust fetchData to include additional parameters
  };

  const handlePerPage = e => {
    // Fetch data here with new rowsPerPage value
    setRowsPerPage(parseInt(e.target.value));
  };

  const handleStatusValue = e => {
    setStatusValue(e.target.value);
    // Fetch data here with new statusValue
  };

  const handlePagination = page => {
    // Fetch data here with new page value
    setCurrentPage(page.selected + 1);
  };




  // Function to reset the state to empty strings
  function emptyField() {
    setdefaultValues({ categoryid: '', categoryname: '', categoryimage: '' });
  }
  const columns = [
    {
      name: 'Id',
      sortable: true,
      sortField: 'id',
      minWidth: '107px',
      cell: (row, key) => {
        const keyToDisplay = key; // Use the provided key directly
        return <Link to={`/apps/invoice/preview/${keyToDisplay}`}>{`${keyToDisplay + 1}`}</Link>;
      }
    },
    {
      name: 'Name',
      sortable: true,
      minWidth: '350px',
      sortField: 'category.name',
      // selector: row => row.client.name,
      cell: row => {
        const name = row.name ? row.name : 'John Doe';
        return (
          <div className='d-flex justify-content-left align-items-center'>
            {/* renderClient(row) - Not sure what renderClient does */}
            <div className='d-flex flex-column'>
              <h6 className='user-name text-truncate mb-0'>{name}</h6>
            </div>
          </div>
        );
      }
    },
    {
      name: 'Aadhar Number',
      sortable: true,
      minWidth: '150px',
      sortField: 'pphoto.name',
      // selector: row => row.client.name,
      cell: row => {

        const categoryimage = row.aadhar_no ? row.aadhar_no : 'categoryimage';
        return (
          <div className='d-flex justify-content-left align-items-center'>
            {/* renderClient(row) - Not sure what renderClient does */}
            <div className='d-flex flex-column'>
              <h6 className='user-name text-truncate mb-0'>{row.aadhar_no}</h6>
            </div>
          </div>
        );
      }
    },
    {
      name: 'Phone Number',
      sortable: true,
      minWidth: '150px',
      sortField: 'pphoto.name',
      // selector: row => row.client.name,
      cell: row => {

        const categoryimage = row.phone_number ? row.phone_number : 'categoryimage';
        return (
          <div className='d-flex justify-content-left align-items-center'>
            {/* renderClient(row) - Not sure what renderClient does */}
            <div className='d-flex flex-column'>
              <h6 className='user-name text-truncate mb-0'>{row.phone_number}</h6>
            </div>
          </div>
        );
      }
    },
    {
      name: 'Payment',
      sortable: true,
      minWidth: '150px',
      sortField: 'pphoto.name',
      // selector: row => row.client.name,
      cell: row => {
        return (
          <div className='d-flex justify-content-left align-items-center'>
            <Button color='success' onClick={() => { getpaymentdetails(row.id) }}>Payment</Button>
          </div>
        );
      }
    },

    {
      name: 'Action',
      minWidth: '110px',
      cell: row => (
        <div className='column-action d-flex align-items-center'>
          {/* <Edit onClick={() => editbutton(row.id)} className='cursor-pointer' size={15} /> */}
          <Info onClick={() => { viewdetails(row.id) }} className='cursor-pointer' size={15} />
        </div>
      )
    }
  ];


  const dataToRender = () => {
    if (!fetchedData) {
      return []; // Return an empty array or another default value
    }

    const filters = {
      q: value,
      status: statusValue
    };

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });

    if (fetchedData.length > 0) {
      // Apply filters and return the filtered data
      let filteredData = fetchedData;

      if (isFiltered) {
        filteredData = fetchedData.filter(item => {
          // Apply your filtering logic here
          // For example, check if item.name includes the search query
          return item.name.toLowerCase().includes(filters.q.toLowerCase());
        });
      }

      // Apply pagination and return the paginated data
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return paginatedData;
    } else {
      return []; // No data to display
    }
  };



  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    // Fetch data here with new sort parameters
  };

  const [partyId, setpartyId] = useState();
  const [partyname, setpartyname] = useState();
  const [partyaadharnumber, setpartyaadharnumber] = useState();
  const [partyphonenumber, setpartyphonenumber] = useState();
  const [partyaddress, setpartyaddress] = useState();
  const [remarks, setremarks] = useState();
  const [createddate, setcreateddate] = useState();
  const [accountid, setAccountid] = useState();
  const [amount, setAmount] = useState();
  const [amountinword, setAmountinword] = useState();
  const [formaccount, setFormaccount] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [paymentOption, setPaymentOption] = useState(null);
  const [selectpayment_typeid, setSelectpayment_typeid] = useState(null);
  const [loader, Setloader] = useState(false);

  // api form state
  const [supplytypeoption, setSupplytypeoption] = useState(null);
  const [supplytype, setSupplytype] = useState();

  const [statecodeovalue, setstatecodeovalue] = useState(null);
  const [statecodeovalue_id, setstatecodeovalueid] = useState();
  const [actfromstatevalue, setactfromstatevalue] = useState(null);
  const [actfromstatevalue_id, setactfromstatevalueid] = useState();
  const [acttostatevalue, setacttostatevalue] = useState(null);
  const [acttostatevalue_id, setacttostatevalueid] = useState();
  const [tostatecodevalue, settostatecodevalue] = useState(null);
  const [tostatecodevalue_id, settostatecodevalueid] = useState();
  const [transactiontypevalue, settransactiontypevalue] = useState(null);
  const [transactiontypevalue_id, settransactiontypevalueid] = useState();
  const [transportationmodevalue, settransportationmodevalue] = useState(null);
  const [transportationmodevalue_id, settransportationmodevalueid] = useState();
  const [vehicletypevalue, setvehicletypevalue] = useState(null);
  const [vehicletypevalue_id, setvehicletypevalueid] = useState();
  const [qtyunitvalue, setqtyunitvalue] = useState(null);
  const [qtyunitvalue_id, setqtyunitvalueid] = useState();

  const [subsupplytypeoption, setSubsupplytypeoption] = useState(null);
  const [subsupplytype, setSubsupplytype] = useState();
  const [subsupplydesc, setSubsupplydesc] = useState();
  const [documenttypeoption, setDocumenttypeoption] = useState(null);
  const [documenttype, setDocumenttype] = useState();
  const [fromGstin, setFromGstin] = useState();
  const [fromTrdName, setFromTrdName] = useState();
  const [fromAddr1, setfromAddr1] = useState();
  const [fromPlace, setfromPlace] = useState();
  const [frompincode, setfrompincode] = useState();
  const [toTrdName, setToTrdName] = useState();
  const [toAddr1, settoAddr1] = useState();
  const [toPlace, SettoPlace] = useState();
  const [topincode, settopincode] = useState();
  const [toGstin, settoGstin] = useState();
  const [dispatchFromGSTIN, setdispatchFromGSTIN] = useState();
  const [dispatchFromTradeName, setdispatchFromTradeName] = useState();
  const [shipToGSTIN, setshipToGSTIN] = useState();
  const [shipToTradeName, setshipToTradeName] = useState();
  const [totalValue, SettotalValue] = useState();
  const [cgstValue, SetcgstValue] = useState();
  const [sgstValue, SetsgstValue] = useState();
  const [igstValue, SetigstValue] = useState();
  const [cessValue, SetcessValue] = useState();
  const [cessNonAdvolValue, SetcessNonAdvolValue] = useState();
  const [totInvValue, SettotInvValue] = useState();
  const [transDistance, SettransDistance] = useState();
  const [transporterName, SettransporterName] = useState();
  const [transporterId, SettransporterId] = useState();
  const [transDocNo, SettransDocNo] = useState();
  const [transDocDate, SettransDocDate] = useState();
  const [vehicleNo, SetvehicleNo] = useState();
  const [productName, SetproductName] = useState();
  const [productDesc, SetproductDesc] = useState();
  const [hsnCode, SethsnCode] = useState();
  const [quantity, Setquantity] = useState();
  const [taxableAmount, SettaxableAmount] = useState();
  const [sgstRate, SetsgstRate] = useState();
  const [cgstRate, SetcgstRate] = useState();
  const [igstRate, SetigstRate] = useState();
  const [cessRate, SetcessRate] = useState();
  const [Ewaybillno, setEwaybillno] = useState();
  const [Mode, setMode] = useState();
  const [Generatedby, setGeneratedby] = useState();
  const [ApproxDistance, setApproxDistance] = useState();  
  const [CEWBno, setCEWBno] = useState();  

  const accountDetails = [];

  const [inputSets, setInputSets] = useState([]);

  const handleAddInputSet = () => {
    setInputSets([
      ...inputSets,
      {
        partyaccountnumber: '',
        partyifsccode: '',
      },
    ]);
  };

  const handleDeleteInputSet = (index) => {
    const updatedInputSets = [...inputSets];
    updatedInputSets.splice(index, 1);
    setInputSets(updatedInputSets);
  };
  inputSets.forEach((inputSet) => {
    accountDetails.push({
      accountNumber: inputSet.partyaccountnumber,
      ifscCode: inputSet.partyifsccode,
    });
  });

  console.log(inputSets);
  
  
  

  

  const issetstatecode = (selectedValue) => {
    setstatecodeovalue(selectedValue);
    setstatecodeovalueid(selectedValue.value);
  };
  const issetactfromstate = (selectedValue) => {
    setactfromstatevalue(selectedValue);
    setactfromstatevalueid(selectedValue.value);
  };
  const issetacttostate = (selectedValue) => {
    setacttostatevalue(selectedValue);
    setacttostatevalueid(selectedValue.value);
  };
  const issettostatecode = (selectedValue) => {
    settostatecodevalue(selectedValue);
    settostatecodevalueid(selectedValue.value);
  };
  const issettransactiontype = (selectedValue) => {
    settransactiontypevalue(selectedValue);
    settransactiontypevalueid(selectedValue.value);
  };
  const issettransportationmode = (selectedValue) => {
    settransportationmodevalue(selectedValue);
    settransportationmodevalueid(selectedValue.value);
  };
  const issetvehicletype = (selectedValue) => {
    setvehicletypevalue(selectedValue);
    setvehicletypevalueid(selectedValue.value);
  };
  const issetqtyunit = (selectedValue) => {
    setqtyunitvalue(selectedValue);
    setqtyunitvalueid(selectedValue.value);
  };

  
  function viewdetails(id) {
    fetch(local_api_url + 'supplier_form_get/' + id, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        setpartyname(data.form_data.name);
        setpartyaadharnumber(data.form_data.aadhar_no);
        setpartyphonenumber(data.form_data.phone_number);
        setpartyaddress(data.form_data.address);
        setremarks(data.form_data.remark);
        setcreateddate(data.form_data.date);
        setFormaccount(data.form_accounts);
        
        setInfoshow(true);
      })
      .catch(error => {
        console.error('Error deleting category:', error);
      });
  }
  const issetsupplytype = (selectedValue) => {
    setSupplytypeoption(selectedValue);
    setSupplytype(selectedValue.value);
  };
  const issetsubsupplytype = (selectedValue) => {
    setSubsupplytypeoption(selectedValue);
    setSubsupplytype(selectedValue.value);
  };
  const issetdocumenttype = (selectedValue) => {
    setDocumenttypeoption(selectedValue);
    setDocumenttype(selectedValue.value);
  };
  const ispaymenttype = (selectedValue) => {
    setPaymentOption(selectedValue);
    setSelectpayment_typeid(selectedValue.value);
  };
  function getpaymentdetails(id) {

    fetch(local_api_url + 'supplier_form_get_payment/' + id, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        setpartyId(id);
        setpartyname(data.form_data.name);
        setpartyaadharnumber(data.form_data.aadhar_no);
        setpartyphonenumber(data.form_data.phone_number);
        setpartyaddress(data.form_data.address);
        setremarks(data.form_data.remark);
        setcreateddate(data.form_data.date);
        setFormaccount(data.form_accounts);
        setShow(true);
      })
      .catch(error => {
        console.error('Error deleting category:', error);
      });

  }
  const groupedOptions = [
    {
      options: formaccount
    }
  ]
  const paymenttype = [
    {
      options: [
        {value : 1 , label : "Full Payment"},
        {value : 2 , label : "Advance Payment"}
      ]
    }
  ]

  const ConvertNumberToWords = (num) => {
    const units = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const thousands = ["", "Thousand", "Lakh", "Crore"];
  
    const capitalizeWord = (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    };
  
    const convertChunk = (chunk) => {
      let chunkStr = "";
  
      if (chunk >= 100) {
        chunkStr += units[Math.floor(chunk / 100)] + " hundred ";
        chunk %= 100;
      }
  
      if (chunk >= 11 && chunk <= 19) {
        chunkStr += teens[chunk - 10];
      } else {
        chunkStr += tens[Math.floor(chunk / 10)];
        chunk %= 10;
  
        if (chunk > 0) {
          chunkStr += " " + units[chunk];
        }
      }
  
      return chunkStr;
    };
  
    if (num === 0) {
      return "Zero";
    }
  
    let result = "";
    let chunkIndex = 0;
  
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk > 0) {
        const chunkStr = convertChunk(chunk);
        result = capitalizeWord(chunkStr) + " "+ thousands[chunkIndex] + " " + result;
      }
      num = Math.floor(num / 1000);
      chunkIndex++;
    }
  
    return result.trim();
  };
  function Handelpaynow(){
    toast.error('Something went wrong with API request', {
      duration: 3000, // 3000 milliseconds (3 seconds)
    });
  }
  const Converttext = val => {
    const number = val;
    const words = ConvertNumberToWords(number);
    console.log(words);
    setAmountinword(words);
    setAmount(val);
  };  
  function deletecategory(lid) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'swal-button-spacing' // Add a custom class for the confirm button
      }
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(local_api_url + 'deleteformsupply/' + lid, {
          method: 'GET'
        })
          .then(response => response.json())
          .then(data => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success',
              showConfirmButton: false,
              timer: 900,
              onClose: () => {
                // Perform any additional actions after the alert is closed
                // For example, you can navigate to another page or update the component state
              }
            });
            fetchData()
          })
          .catch(error => {
            // Handle error here, show an error message or perform other actions
            console.error('Error deleting category:', error);
          });
      }
    });
  }
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.addEventListener('change', handleFileChange);
    }
  }, [fileInputRef]);
  const handleCardClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the click event on the file input
    }
  };
  function editbutton(lid) {
    setupdateshow(true)
    fetch(api_url + 'editcategory/' + lid, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setcategoryid(data.id)
        setcategoryname(data.name)
        setcatimg(local_api_assets_url + data.categoryimage)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Handle the error here, e.g., display an error message to the user
      });
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setcatimg(e.target.result);
      };
      reader.readAsDataURL(file);
      setuploadfile(file);
    }
  };
  const [catimg, setcatimg] = useState(null);
  const [updateshow, setupdateshow] = useState(false);
  const [categoryid, setcategoryid] = useState(0);
  const [categoryname, setcategoryname] = useState();
  const [uploadfile, setuploadfile] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('categoryid', categoryid);
    formdata.append('categoryname', categoryname);
    formdata.append('categoryimage', uploadfile);
    fetch(api_url + 'addcategory', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(data => {
        // Check if the upload was successful based on your API response
        if (data) {
          console.log(data)
          setupdateshow(false)
          // Display a success toast that auto-closes after 3 seconds
          toast.success('Updated successfully', {
            duration: 3000, // 3000 milliseconds (3 seconds)
          });
          fetchData();
        } else {
          // Display an error toast if the API response indicates an error
          toast.error('Upload failed');
        }
      })
      .catch(error => {
        // Display an error toast for network errors or other issues
        toast.error('Upload error: ' + error.message);
        console.error('Upload error:', error);
      });
  };

  const modalShowDataStyle = {
    border: '1px solid rgb(233 233 233)',
    borderRadius: '7px',
    padding: '9px 8px',
  };

  const supplytype_option = [
    {
      options: [
        {value : 'I' , label : "Inward"},
        {value : 'O' , label : "Outward"}
      ]
    }
  ]
  const subsupplytype_option = [
    {
      options: [
        {value : '1' , label : "Supply"},
        {value : '2' , label : "Import"},
        {value : '3' , label : "Export"},
        {value : '4' , label : "Job Work"},
        {value : '5' , label : "For Own Use"},
        {value : '6' , label : "Job work Returns"},
        {value : '7' , label : "Sales Return"},
        {value : '8' , label : "Others"},
        {value : '9' , label : "SKD/CKD/Lots"},
        {value : '10' , label : "Line Sales"},
        {value : '11' , label : "Recipient Not Known"},
        {value : '12' , label : "Exhibition or Fairs"}
      ]
    }
  ]
  const documenttype_option = [
    {
      options: [
        {value : 'INV' , label : "Tax Invoice"},
        {value : 'BIL' , label : "Bill of Supply"},
        {value : 'BOE' , label : "Bill of Entry"},
        {value : 'CHL' , label : "Delivery Challan"},
        {value : 'OTH' , label : "Others"}
      ]
    }
  ]
  const StateCodeoptions = [
    {
      options: [
        { value : '1' , label : 'JAMMU AND KASHMIR'},
        { value : '2' , label : 'HIMACHAL PRADESH'},
        { value : '3' , label : 'PUNJAB'},
        { value : '4' , label : 'CHANDIGARH'},
        { value : '5' , label : 'UTTARAKHAND'},
        { value : '6' , label : 'HARYANA'},
        { value : '7' , label : 'DELHI'},
        { value : '8' , label : 'RAJASTHAN'},
        { value : '9' , label : 'UTTAR PRADESH'},
        { value : '10' , label : 'BIHAR'},
        { value : '11' , label : 'SIKKIM'},
        { value : '12' , label : 'ARUNACHAL PRADESH'},
        { value : '13' , label : 'NAGALAND'},
        { value : '14' , label : 'MANIPUR'},
        { value : '15' , label : 'MIZORAM'},
        { value : '16' , label : 'TRIPURA'},
        { value : '17' , label : 'MEGHALAYA'},
        { value : '18' , label : 'ASSAM'},
        { value : '19' , label : 'WEST BENGAL'},
        { value : '20' , label : 'JHARKHAND'},
        { value : '21' , label : 'ORISSA'},
        { value : '22' , label : 'CHHATTISGARH'},
        { value : '23' , label : 'MADHYA PRADESH'},
        { value : '24' , label : 'GUJARAT'},
        { value : '26' , label : 'DADAR AND NAGAR HAVELI & DAMAN AND DIU'},
        { value : '27' , label : 'MAHARASHTRA'},
        { value : '29' , label : 'KARNATAKA'},
        { value : '30' , label : 'GOA'},
        { value : '31' , label : 'LAKSHADWEEP'},
        { value : '32' , label : 'KERALA'},
        { value : '33' , label : 'TAMIL NADU'},
        { value : '34' , label : 'PUDUCHERRY'},
        { value : '35' , label : 'ANDAMAN AND NICOBAR'},
        { value : '36' , label : 'TELANGANA'},
        { value : '37' , label : 'ANDHRA PRADESH'},
        { value : '38' , label : 'LADAKH'},
        { value : '97' , label : 'OTHER TERRITORY'},
        { value : '99' , label : 'OTHER COUNTRY'}
      ]
    }
  ]
  const transactiontype = [
    {
      options: [
        {value : '1' , label : "Regular"},
        {value : '2' , label : "Bill To - Ship To"},
        {value : '3' , label : "Bill From - Dispatch From"},
        {value : '4' , label : "Combination of 2 and 3"}
      ]
    }
  ]
  const transmode_option = [
    {
      options: [
        {value : '1' , label : "Road"},
        {value : '2' , label : "Rail"},
        {value : '3' , label : "Air"},
        {value : '4' , label : "Ship"},
        {value : '5' , label : "inTransit3"}
      ]
    }
  ]
  const vehicletype_option = [
    {
      options: [
        {value : 'R' , label : "Regular"},
        {value : 'O' , label : "ODC(Over Dimentional Cargo)"},
      ]
    }
  ]
  const qtyUnit_options = [
    {
      options: [
        {value : 'BAG' , label : "BAGS"},
        {value : 'BAL' , label : "BALE"},
        {value : 'BDL' , label : "BUNDLES"},
        {value : 'BKL' , label : "BUCKLES"},
        {value : 'BOU' , label : "BILLION OF UNITS"},
        {value : 'BOX' , label : "BOX"},
        {value : 'BTL' , label : "BOTTLES"},
        {value : 'BUN' , label : "BUNCHES"},
        {value : 'CAN' , label : "CANS"},
        {value : 'CBM' , label : "CUBIC METERS"},
        {value : 'CCM' , label : "CUBIC CENTIMETERS"},
        {value : 'CMS' , label : "CENTI METERS"},
        {value : 'CTN' , label : "CARTONS"},
        {value : 'DOZ' , label : "DOZENS"},
        {value : 'DRM' , label : "DRUMS"},
        {value : 'GGK' , label : "GREAT GROSS"},
        {value : 'GMS' , label : "GRAMMES"},
        {value : 'GRS' , label : "GROSS"},
        {value : 'GYD' , label : "GROSS YARDS"},
        {value : 'KGS' , label : "KILOGRAMS"},
        {value : 'KLR' , label : "KILOLITRE"},
        {value : 'KME' , label : "KILOMETRE"},
        {value : 'LTR' , label : "LITRES"},
        {value : 'MTR' , label : "METERS"},
        {value : 'MLT' , label : "MILILITRE"},
        {value : 'MTS' , label : "METRIC TON"},
        {value : 'NOS' , label : "NUMBERS"},
        {value : 'OTH' , label : "OTHERS"},
        {value : 'PAC' , label : "PACKS"},
        {value : 'PCS' , label : "PIECES"},
        {value : 'PRS' , label : "PAIRS"},
        {value : 'QTL' , label : "QUINTAL"},
        {value : 'ROL' , label : "ROLLS"},
        {value : 'SET' , label : "SETS"},
        {value : 'SQF' , label : "SQUARE FEET"},
        {value : 'SQM' , label : "SQUARE METERS"},
        {value : 'SQY' , label : "SQUARE YARDS"},
        {value : 'TBS' , label : "TABLETS"},
        {value : 'TGM' , label : "TEN GROSS"},
        {value : 'THD' , label : "THOUSANDS"},
        {value : 'TON' , label : "TONNES"},
        {value : 'TUB' , label : "TUBES"},
        {value : 'UGS' , label : "US GALLONS"},
        {value : 'UNT' , label : "UNITS"},
        {value : 'YDS' , label : "YARDS"}
      ]
    }
  ]

  return (

    <div className='invoice-list-wrapper'>
      <Card>
      <CardBody>
        <div>
        <Row>
        <Col md={12} className='mb-2'>
            <h3>1. e-Way Bill Details</h3>
        </Col>    
        <Col md={4} className='mb-2'>
            <Label className='form-label' for='categoryname'>
                e-Way Bill No
            </Label>
            <input
              name='ewaybillno' // Add a name prop to match your form structure if needed
              id='ewaybillno'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={Ewaybillno}
              onChange={e => setEwaybillno(e.target.value)}
            />
          </Col>
          <Col md={4} className='mb-2'>
            <Label className='form-label' for='categoryname'>
                Mode
            </Label>
            <input
              name=''
              id=''
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={Mode}
              onChange={e => setMode(e.target.value)}
            />
          </Col>
          <Col md={4} className='mb-2'>
            <Label className='form-label' for='categoryname'>
                Generated By
            </Label>
            <input
              name=''
              id=''
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={Generatedby}
              onChange={e => setGeneratedby(e.target.value)}
            />
          </Col>
          <Col md={4} className='mb-2'>
                <Label className='form-label' for='status'>
                  Select Supply Type
                </Label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  options={supplytype_option}
                  className='react-select'
                  classNamePrefix='select'
                  onChange={issetsupplytype}
                  value={supplytypeoption}
                />
          </Col>
          <Col md={4} className='mb-2'>
            <Label className='form-label' for='categoryname'>
                Approx Distance
            </Label>
            <input
              name=''
              id=''
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={ApproxDistance}
              onChange={e => setApproxDistance(e.target.value)}
            />
          </Col>
          <Col md={4} className='mb-2'>
                <Label className='form-label' for='status'>
                  Transaction Type
                </Label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  options={transactiontype}
                  className='react-select'
                  classNamePrefix='select'
                  onChange={issettransactiontype}
                  value={transactiontypevalue}
                />
          </Col>
          <Col md={12} className='mb-2'>
            <h3>2. Address Details</h3>
        </Col>  
        <Col md={1} className='mb-2'>
            <h3>From</h3>
          </Col>
        <Col md={2} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              From Name
            </Label>
            <input
              name='fromTrdName' // Add a name prop to match your form structure if needed
              id='fromTrdName'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={fromTrdName}
              onChange={e => setFromTrdName(e.target.value)}
            />
          </Col>  
          <Col md={2} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              From Gstin
            </Label>
            <input
              name='fromGstin' // Add a name prop to match your form structure if needed
              id='fromGstin'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={fromGstin}
              onChange={e => setFromGstin(e.target.value)}
            />
          </Col>
          <Col md={2} className='mb-2'>
                <Label className='form-label' for='status'>
                  From State
                </Label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  options={StateCodeoptions}
                  className='react-select'
                  classNamePrefix='select'
                  onChange={issetstatecode}
                  value={statecodeovalue}
                />
          </Col>
          <Col md={3} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              From Address
            </Label>
            <input
              name='fromAddr1' // Add a name prop to match your form structure if needed
              id='fromAddr1'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={fromAddr1}
              onChange={e => setfromAddr1(e.target.value)}
            />
          </Col>
          <Col md={2} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              From Pincode
            </Label>
            <input
              name='frompincode' // Add a name prop to match your form structure if needed
              id='frompincode'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={frompincode}
              onChange={e => setfrompincode(e.target.value)}
            />
          </Col>
          <Col md={1} className='mb-2'>
            <h3>To</h3>
          </Col>
          <Col md={2} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              To Name
            </Label>
            <input
              name='toTrdName' // Add a name prop to match your form structure if needed
              id='toTrdName'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={toTrdName}
              onChange={e => setToTrdName(e.target.value)}
            />
          </Col>
          <Col md={2} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              To Gstin
            </Label>
            <input
              name='toGstin' // Add a name prop to match your form structure if needed
              id='toGstin'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={toGstin}
              onChange={e => settoGstin(e.target.value)}
            />
          </Col>
          <Col md={2} className='mb-2'>
                <Label className='form-label' for='status'>
                  To State
                </Label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  options={StateCodeoptions}
                  className='react-select'
                  classNamePrefix='select'
                  onChange={issettostatecode}
                  value={tostatecodevalue}
                />
          </Col>
          <Col md={3} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              To Address
            </Label>
            <input
              name='toAddr1' // Add a name prop to match your form structure if needed
              id='toAddr1'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={toAddr1}
              onChange={e => settoAddr1(e.target.value)}
            />
          </Col>
          <Col md={2} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              To Pincode
            </Label>
            <input
              name='frompincode' // Add a name prop to match your form structure if needed
              id='frompincode'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={topincode}
              onChange={e => settopincode(e.target.value)}
            />
          </Col>
          <Col md={12} className='mb-2'>
            <h3>3. Goods Details</h3>
            <Button type='button' className='me-1' color='success' onClick={handleAddInputSet}>Add +</Button>
            </Col>  
            <Col md={2} className='mb-2'><p>HSN code</p></Col>
            <Col md={3} className='mb-2'><p>Product Name & Desc</p></Col>
            <Col md={2} className='mb-2'><p>Quantity</p></Col>
            <Col md={2} className='mb-2'><p>Taxable Amt</p></Col>
            <Col md={2} className='mb-2'><p>Tax Rate (I)</p></Col>
            <Col md={1} className='mb-2'></Col>

            {inputSets.map((inputSet, index) => (
              <Row key={index}>
            <Col md={2} className='mb-2'>
                <input
                name='' // Add a name prop to match your form structure if needed
                id=''
                placeholder=''
                className='custom-input-class form-control'
                style={{ fontSize: '16px' }}
                />
            </Col>
            <Col md={3} className='mb-2'>
                <input
                name='' // Add a name prop to match your form structure if needed
                id=''
                placeholder=''
                className='custom-input-class form-control'
                style={{ fontSize: '16px' }}
                />
            </Col>
            <Col md={2} className='mb-2'>
                <input
                name='' // Add a name prop to match your form structure if needed
                id=''
                placeholder=''
                className='custom-input-class form-control'
                style={{ fontSize: '16px' }}
                />
            </Col>
            <Col md={2} className='mb-2'>
                <input
                name='' // Add a name prop to match your form structure if needed
                id=''
                placeholder=''
                className='custom-input-class form-control'
                style={{ fontSize: '16px' }}
                />
            </Col>
            <Col md={2} className='mb-2'>
                <input
                name='' // Add a name prop to match your form structure if needed
                id=''
                placeholder=''
                className='custom-input-class form-control'
                style={{ fontSize: '16px' }}
                />
            </Col>
            <Col md={1} className='mb-2'>
            <Button type='button' className='me-1' color='danger' onClick={() => handleDeleteInputSet(index)}>-</Button>
            </Col>
            </Row>
            ))}
            <Col md={12} className='mb-2'>
            <h3>4. Transportation Details</h3>
            </Col>  
            <Col md={3} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              Transporter Name
            </Label>
            <input
              name='transporterName' // Add a name prop to match your form structure if needed
              id='transporterName'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={transporterName}
              onChange={e => SettransporterName(e.target.value)}
            />
            </Col>
            <Col md={3} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              Transporter Id
            </Label>
            <input
              name='transporterId' // Add a name prop to match your form structure if needed
              id='transporterId'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={transporterId}
              onChange={e => SettransporterId(e.target.value)}
            />
            </Col>
            <Col md={3} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              Trans Doc No
            </Label>
            <input
              name='transDocNo' // Add a name prop to match your form structure if needed
              id='transDocNo'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={transDocNo}
              onChange={e => SettransDocNo(e.target.value)}
            />
            </Col>
            <Col md={3} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              Trans Doc Date
            </Label>
            <input
              name='transDocDate' // Add a name prop to match your form structure if needed
              id='transDocDate'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={transDocDate}
              onChange={e => SettransDocDate(e.target.value)}
            />
            </Col>
            <Col md={12} className='mb-2'>
            <h3>5. Vehicle Details</h3>
            </Col>  
            <Col md={4} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              Vehicle No
            </Label>
            <input
              name='vehicleNo' // Add a name prop to match your form structure if needed
              id='vehicleNo'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={vehicleNo}
              onChange={e => SetvehicleNo(e.target.value)}
            />
            </Col>
            <Col md={4} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              From
            </Label>
            <input
              name='fromPlace' // Add a name prop to match your form structure if needed
              id='fromPlace'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={fromPlace}
              onChange={e => setfromPlace(e.target.value)}
            />
            </Col>
            <Col md={4} className='mb-2'>
            <Label className='form-label' for='categoryname'>
              CEWB No
            </Label>
            <input
              name='fromPlace' // Add a name prop to match your form structure if needed
              id='fromPlace'
              placeholder=''
              className='custom-input-class form-control'
              style={{ fontSize: '16px' }}
              value={CEWBno}
              onChange={e => setCEWBno(e.target.value)}
            />
            </Col>
            <Col md={12}>
          {loader ?(
              <Button color='success' disabled type='button'>Loading...</Button>
            ):(
              <Button color='success' onClick={Handelpaynow}>Submit</Button>
            )}
          </Col>
        </Row>
        </div>
        </CardBody>
      </Card>
    </div>
  )
};
export default InvoiceList;
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
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setcategoryimage(file)

    };
    console.log(inputSets);
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
    //   setFetchedData(data);
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
      name: 'FROM GST No',
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
      name: 'To GST No',
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
      name: 'Bill Date',
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
  
  const issuedata = (selectedValue) => {
    setSelectedOption(selectedValue);
    setAccountid(selectedValue.value);
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
    if(!partyId || !partyname || !partyaadharnumber || !partyphonenumber || !accountid || !amount || !selectpayment_typeid){
      toast.error("All field required");
    }else{
      Setloader(true);
      const formdata = new FormData();
    formdata.append('partyid', partyId);
    formdata.append('partyname', partyname);
    formdata.append('partyaadharnumber', partyaadharnumber);
    formdata.append('partyphonenumber', partyphonenumber);
    formdata.append('accountid', accountid);
    formdata.append('amount', amount);
    formdata.append('selectpayment_typeid', selectpayment_typeid);
    fetch(local_api_url + 'payment_handel', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(data => {
        Setloader(false);
        // Check if the upload was successful based on your API response
        if (data.status_code == 200) {
          setShow(false);
          setupdateshow(false)
          // Display a success toast that auto-closes after 3 seconds
          toast.success('Money transfer successful', {
            duration: 3000, // 3000 milliseconds (3 seconds)
          });
          fetchData();
        } else if(data.status_code == 400) {
          // Display an error toast if the API response indicates an error
          toast.error(data.response);
        }
      })
      .catch(error => {
        // Display an error toast for network errors or other issues
        toast.error('Upload error: ' + error.message);
        console.error('Upload error:', error);
      });   
    }
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
  return (

    <div className='invoice-list-wrapper'>
      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
              <div className='text-center mb-2'>
                <h1 className='mb-1'>Payment</h1>
              </div>
              <form enctype="multipart/form-data" onSubmit={onsubmit}>
                <Row>
                  <Col md={4} className='mb-2'>
                    <Label className='form-label' for='categoryname'>
                      Party Name
                    </Label>
                    <input
                      name='partyname' // Add a name prop to match your form structure if needed
                      id='partyname'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                      value={partyname}
                      disabled
                    />
                  </Col>
                  <Col md={4} className='mb-2'>
                    <Label className='form-label' for='categoryname'>
                      Party Aadhar Number
                    </Label>
                    <input
                      name='partyname' // Add a name prop to match your form structure if needed
                      id='partyname'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                      value={partyaadharnumber}
                      disabled
                    />
                  </Col>
                  <Col md={4} className='mb-2'>
                    <Label className='form-label' for='categoryname'>
                      Party Phone Number
                    </Label>
                    <input
                      name='partyname' // Add a name prop to match your form structure if needed
                      id='partyname'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                      value={partyphonenumber}
                      disabled
                    />
                  </Col>
                  <Col md={6} className='mb-2'>
                  <Label className='form-label' for='status'>
                          Select Bank Account
                        </Label>
                        <Select
                          isClearable={false}
                          theme={selectThemeColors}
                          options={groupedOptions}
                          className='react-select'
                          classNamePrefix='select'
                          onChange={issuedata}
                          value={selectedOption}
                        />
                  </Col>
                  <Col md={6} className='mb-2'>
                  <Label className='form-label' for='status'>
                          Payment Type
                        </Label>
                        <Select
                          isClearable={false}
                          theme={selectThemeColors}
                          options={paymenttype}
                          className='react-select'
                          classNamePrefix='select'
                          onChange={ispaymenttype}
                          value={paymentOption}
                        />
                  </Col>
                  <Col md={6} className='mb-2'>
                  <Label className='form-label' for='categoryname'>
                      Enter Amount
                    </Label>
                    <input
                      name='amount' // Add a name prop to match your form structure if needed
                      id='amount'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                      value={amount}
                      onChange={e => Converttext(e.target.value)}
                    />
                  </Col>
                  <Col md={6} className='mb-2'>
                  <Label className='form-label' for='categoryname'>
                      In Word
                    </Label>
                    <input
                      name='amount' // Add a name prop to match your form structure if needed
                      id='amount'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                      value={amountinword}
                      disabled
                    />
                  </Col>
                  <Col md={12}>
                  {loader ?(
                      <Button color='success' disabled type='button'>Loading...</Button>
                    ):(
                      <Button color='success' onClick={Handelpaynow}>Pay Now</Button>
                    )}
                  </Col>
                </Row>
              </form>
            </ModalBody>
          </Modal>
      <Modal isOpen={infoshow} toggle={() => setInfoshow(!infoshow)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setInfoshow(!infoshow)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Supplier Form</h1>
          </div>
          <Row className='gy-1 pt-75'>
            <Col xs={6}>
              <Label className='form-label' for='categoryname'>
                Party Name
              </Label>
              <div>
                <h5 style={modalShowDataStyle}>{partyname}</h5>
              </div>
            </Col>
            <Col xs={6}>
              <Label className='form-label' for='categoryname'>
                Party Aadhar Number
              </Label>
              <h5 style={modalShowDataStyle}>{partyaadharnumber}</h5>
            </Col>
            <Col xs={6}>
              <Label className='form-label' for='categoryname'>
                Party Phone Number
              </Label>
              <h5 style={modalShowDataStyle}>{partyphonenumber}</h5>
            </Col>
            <Col xs={6}>
              <Label className='form-label' for='categoryname'>
                Party Address
              </Label>
              <h5 style={modalShowDataStyle}>{partyaddress}</h5>
            </Col>
            <Col xs={6}>
              <Label className='form-label' for='categoryname'>
                Remarks
              </Label>
              <h5 style={modalShowDataStyle}>{remarks}</h5>
            </Col>
            <Col xs={6}>
              <Label className='form-label' for='categoryname'>
                Created Date
              </Label>
              <h5 style={modalShowDataStyle}>{createddate}</h5>
            </Col>
            <Col xs={12}>
              <h3>Account details</h3>
            </Col>
            <Col xs={6}>
              <Label className='form-label' for='categoryname'>Account Number</Label>
            </Col>
            <Col xs={6}>
              <Label className='form-label' for='categoryname'>IFSC Code</Label>
            </Col>
            {formaccount.map((items, index) => (
              <>
                <Col xs={6}>
                  <h5 style={modalShowDataStyle}>{items.account_no}</h5>
                </Col>
                <Col xs={6}>
                  <h5 style={modalShowDataStyle}>{items.ifsc}</h5>
                </Col>
              </>
            ))}
          </Row>
        </ModalBody>
      </Modal>
      <Card>
        <div className='invoice-list-dataTable react-dataTable '>
          <DataTable
            noHeader
            sortServer
            subHeader={true}
            columns={columns}
            responsive={true}
            onSort={handleSort}
            data={dataToRender()}
            sortIcon={<ChevronDown />}
            className='react-dataTable text-center'
            defaultSortField='invoiceId'
            subHeaderComponent={
              <CustomHeader
                value={value}
                statusValue={statusValue}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                handleStatusValue={handleStatusValue}
              />
            }
          />
        </div>
      </Card>
    </div>
  )
};
export default InvoiceList;
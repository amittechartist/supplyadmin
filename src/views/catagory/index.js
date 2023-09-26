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
    const [loader, setLoader] = useState(false);
    const accountDetails = [];
    if(partyaccountnumber.length > 0 && partyifsccode.length > 0){
      accountDetails.push({
          accountNumber: partyaccountnumber,
          ifscCode: partyifsccode,
      });
    }
    const onsubmit = (e) => {
      e.preventDefault();
      if(!partyname || !partyaadharnumber || !partyphonenumber || !partyaddress){
        toast.error('All fields are mandatory', {
          duration: 3000, // 3000 milliseconds (3 seconds)
        });
        return false;
      }
      if(!accountDetails.length > 0){
        toast.error('Enter bank details', {
          duration: 3000, // 3000 milliseconds (3 seconds)
        });
        return false;
      }
      
      if (!/^\d{12}$/.test(partyaadharnumber)) {
        toast.error('Aadhar Number must be 12 digits', {
          duration: 3000,
        });
        return false;
      }
      
      // Validate Phone Number (10 digits)
      if (!/^\d{10}$/.test(partyphonenumber)) {
        toast.error('Phone Number must be 10 digits', {
          duration: 3000,
        });
        return false;
      }
      setLoader(true);
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
          setLoader(false);
          if (data.status_code == 200) {
            toast.success('Supplier account creation successful', {
              duration: 3000,
            });
            fetchData();
          } else if(data.status_code == 400) {
            toast.error(data.error_message);
          }else{
            toast.error('Server Issue');
          }
        })
        .catch(error => {
          setLoader(false);
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
      if(inputSet.partyaccountnumber.length > 0 && inputSet.partyifsccode.length > 0 ){
        accountDetails.push({
          accountNumber: inputSet.partyaccountnumber,
          ifscCode: inputSet.partyifsccode,
        });
      }
    });
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setcategoryimage(file)

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
            <Button color='primary' onClick={() => { emptyField(); setShow(true) }}>
              Add New
            </Button>
          </Col>
          <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
              <div className='text-center mb-2'>
                <h1 className='mb-1'>Supplier Form</h1>
              </div>
              <form enctype="multipart/form-data" onSubmit={onsubmit}>
                <Row className='gy-1 pt-75'>
                  <Col xs={6}>
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
                      onChange={(e) => setpartyname(e.target.value)}
                    />
                  </Col>
                  <Col xs={6}>
                    <Label className='form-label' for='categoryname'>
                      Party Aadhar Number
                    </Label>
                    <input
                      type='number'
                      name='partyaadharnumber' // Add a name prop to match your form structure if needed
                      id='partyaadharnumber'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                      value={partyaadharnumber}
                      onChange={(e) => setpartyaadharnumber(e.target.value)}
                    />
                  </Col>
                  <Col xs={6}>
                    <Label className='form-label' for='categoryname'>
                      Party Phone Number
                    </Label>
                    <input
                      type='number'
                      name='partyphonenumber' // Add a name prop to match your form structure if needed
                      id='partyphonenumber'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                      value={partyphonenumber}
                      onChange={(e) => setpartyphonenumber(e.target.value)}
                    />
                  </Col>
                  <Col xs={6}>
                    <Label className='form-label' for='categoryname'>
                      Party Address
                    </Label>
                    <input
                      name='partyaddress' // Add a name prop to match your form structure if needed
                      id='partyaddress'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                      value={partyaddress}
                      onChange={(e) => setpartyaddress(e.target.value)}
                    />
                  </Col>
                  <Col xs={6}>
                    <Label className='form-label' for='categoryname'>
                      Remarks
                    </Label>
                    <input
                      name='remarks' // Add a name prop to match your form structure if needed
                      id='remarks'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                      value={remarks}
                      onChange={(e) => setremarks(e.target.value)}
                    />
                  </Col>
                  <Col xs={12}>
                    <h3>Account details</h3>
                  </Col>
                  <Col xs={12}>

                    {inputSets.map((inputSet, index) => (
                      <Row key={index} className='mb-1'>
                        <Col xs={5}>
                          <input
                            name='categoryname'
                            id={`partyaccountnumber_${index}`}
                            placeholder='Account Number'
                            className='custom-input-class form-control'
                            style={{ fontSize: '16px' }}
                            value={inputSet.partyaccountnumber}
                            onChange={(e) =>
                              handleInputChange(index, 'partyaccountnumber', e.target.value)
                            }
                          />
                        </Col>
                        <Col xs={5}>
                          <input
                            name='categoryname'
                            id={`partyifsccode_${index}`}
                            placeholder='IFSC Code'
                            className='custom-input-class form-control'
                            style={{ fontSize: '16px' }}
                            value={inputSet.partyifsccode}
                            onChange={(e) =>
                              handleInputChange(index, 'partyifsccode', e.target.value)
                            }
                          />
                        </Col>
                        <Col xs={2} className='d-flex align-baseline'>
                          <Button
                            type='button'
                            className='me-1'
                            color='danger'
                            onClick={() => handleDeleteInputSet(index)}
                          >
                            -
                          </Button>
                        </Col>
                      </Row>
                    ))}
                  </Col>
                  <Col xs={12} className='d-flex align-baseline'>
                    <Button type='button' className='me-1' color='primary' onClick={handleAddInputSet}>
                      Add Party Account Details
                    </Button>
                  </Col>
                  <Col xs={12} className='text-center mt-2 pt-50'>
                    {loader ?(
                      <Button type='button' disabled className='me-1' color='primary'>Loading...</Button>
                    ):(
                      <Button type='submit' className='me-1' color='primary'>Submit</Button>
                    )
                    }
                    <Button type='reset' color='secondary' outline onClick={() => setShow(false)}>
                      Discard
                    </Button>
                  </Col>
                </Row>
              </form>
            </ModalBody>
          </Modal>
          
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
  const [partyname, setpartyname] = useState();
  const [partyaadharnumber, setpartyaadharnumber] = useState();
  const [partyphonenumber, setpartyphonenumber] = useState();
  const [partyaddress, setpartyaddress] = useState();
  const [remarks, setremarks] = useState();
  const [createddate, setcreateddate] = useState();
  const [formaccount, setFormaccount] = useState([]);
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
      <Modal isOpen={updateshow} toggle={() => setupdateshow(!updateshow)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setupdateshow(!updateshow)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Update Product</h1>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit}>
            <Row className='gy-1 pt-75'>
              <Col xs={6}>
                <Label className='form-label' for='categoryname'>
                  Category
                </Label>
                <input
                  name='categoryname' // Add a name prop to match your form structure if needed
                  id='categoryname'
                  placeholder=''
                  className='custom-input-class form-control'
                  style={{ fontSize: '16px' }}
                  value={categoryname}
                  onChange={(e) => setcategoryname(e.target.value)}
                />
              </Col>
              <Col xs={6}>
                <Label className='form-label' for='categoryimage'>
                  Choose icon
                </Label>

                <div className='d-flex justify-content-center'>
                  {catimg ? (
                    <>
                      <img
                        src={catimg}
                        onClick={handleCardClick}
                        alt="Preview"
                        className='img-fluid'
                        style={{ cursor: 'pointer', height: '270px', width: '350px' }}
                      />
                      <input type='file' ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                    </>

                  ) : (
                    <input type='file' className='form-control' ref={fileInputRef} onChange={handleFileChange} />
                  )}
                </div>
              </Col>
            </Row>
            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='submit' className='me-1' color='primary'>
                Submit
              </Button>
              <Button type='reset' color='secondary' outline onClick={() => setupdateshow(false)}>
                Discard
              </Button>
            </Col>
          </Row>
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
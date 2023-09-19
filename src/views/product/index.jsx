// ** React Imports
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, Fragment } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { User, Check, X, CloudOff } from 'react-feather'
import { selectThemeColors } from '@utils'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
// ** Reactstrap Imports
import { Button, Input, Row, Col, Card } from 'reactstrap'
// ** Styles
import '@styles/react/apps/app-invoice.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
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
import { api_url, app_url, api_assets_url,local_api_url } from '@src/common/Helpers'
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
// 
const InvoiceList = () => {
  const CustomHeader = ({ handleFilter, value, handleStatusValue, statusValue, handlePerPage, rowsPerPage }) => {
    const [show, setShow] = useState(false)
    const [categoryid, setcategoryid] = useState("");
    const [metatitle, setmetatitle] = useState("");
    const [trno, settrno]  = useState("");
    const [vehicleno, setvehicleno]  = useState("");
    const [typeofmaterial, settypeofmaterial]  = useState("");
    const [grossweight, setgrossweight]  = useState("");
    const [tareweight, settareweight]  = useState("");
    const [netweight, setnetweight]  = useState("");
    const [metades, setmetades] = useState("");
    const [metaimage, setmetaimage] = useState(null);
    const [pickerin, setPickerin] = useState(new Date())
    const [pickerout, setPickerout] = useState(new Date())
    const [supplyid, setSupplyid]  = useState("");
    const [aadharno, setAadharno]  = useState("");
    const [partyname, setpartyname]  = useState("");
    const [partyphonenumber, setpartyphonenumber]  = useState("");
    const [partyaddress, setpartyaddress]  = useState("");
    const [reamak, setreamak]  = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const handleFileChangemeta = (e) => {
      const file = e.target.files[0]; // Get the first selected file
      setmetaimage(file);
    };
    const issuedata = (selectedValue) => {
      setSelectedOption(selectedValue);
      fetchaadhardata(selectedValue.value);
    };
    function fetchaadhardata(id) {
        if(id){
          fetch(local_api_url + 'supplier_form_get/' + id, {
            method: 'GET'
          })
            .then(response => response.json())
            .then(data => {
              setSupplyid(data.form_data.id);
              setAadharno(data.form_data.aadhar_no);
              setpartyname(data.form_data.name);
              setpartyphonenumber(data.form_data.phone_number);
              setpartyaddress(data.form_data.address);
              setreamak(data.form_data.remark);
            })
            .catch(error => {
              console.error('Error deleting category:', error);
            }); 
        }
    }
    const onSubmit = data => {
      // setShow(false);
    // pickerin
    // pickerout
    const get_in_data = new Date(pickerin);
    const formattedDate_in = get_in_data.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  
    const formattedTime_in = get_in_data.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const get_out_data = new Date(pickerout);
    const formattedDate_out = get_out_data.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  
    const formattedTime_out = get_out_data.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
      const formdata = new FormData();
      formdata.append('supply_id', supplyid);
      formdata.append('trno', trno);
      formdata.append('vehicleno', vehicleno);

      formdata.append('datein', formattedDate_in);
      formdata.append('timein', formattedTime_in);
      formdata.append('dateout', formattedDate_out);
      formdata.append('timeout', formattedTime_out);

      formdata.append('typeofmaterial', typeofmaterial);
      formdata.append('grossweight', grossweight);
      formdata.append('tareweight', tareweight);
      formdata.append('netweight', netweight);
      fetch(local_api_url + 'slip_store', {
        method: 'POST',
        body: formdata,
      })
        .then(response => response.json())
        .then(data => {
          // Check if the upload was successful based on your API response
          if (data) {
            fetchData();
            // Display a success toast that auto-closes after 3 seconds
            toast.success('Slip generate successfully', {
              duration: 3000, // 3000 milliseconds (3 seconds)
            });
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
    useEffect(() => {
      fetchcategory()
      fetchaadharlist()
    }, []);
    const fetchcategory = () => {
      fetch(api_url + 'categorylist').then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then((data) => {
        let arrissue = [];
        if (data.length > 0) {
          for (let x in data) {
            if (x == 0) {
              setcategoryid(data[x].id)
            }
            let obj = { value: data[x].id, label: data[x].name };
            arrissue.push(obj);
          }
        }
        setstatusOptions(arrissue);
      })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
    const fetchaadharlist = () => {
      fetch(local_api_url + 'get_aadhar_list').then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then((data) => {
        setaadharlist(data);
      })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
    
    const [statusOptions, setstatusOptions] = useState([
      { value: "", label: "" },
    ]);
    const [aadharlist, setaadharlist] = useState([
      { value: "", label: "" },
    ]);



    // ** Hooks
    const {
      control,
      setError,
      handleSubmit,
      formState: { errors }
    } = useForm({})

    const fileInputRef = useRef(null);
    const [image, setuploadfile] = useState([]);
    const [profilephoto, setProfilePhoto] = useState(null);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [iscustom, setiscustom] = useState([])
    const sizeOptions = [
      { value: 'XS', label: 'XS' },
      { value: 'S', label: 'S' },
      { value: 'M', label: 'M' },
      { value: 'L', label: 'L' },
      { value: 'XL', label: 'XL' },
      { value: 'XXL', label: 'XXL' },
      { value: 'XXXL', label: 'XXXL' },
      { value: 'custom', label: 'Custom' },
    ];
    const handleSizeChange = (selectedOptions) => {
      for (let x in selectedOptions) {
        if (selectedOptions[x].value == 'custom') {
          setiscustom(1);
        }
        else {
          setiscustom(0);
          setSelectedSizes(selectedOptions);
        }
      }
      setSelectedSizes(selectedOptions);
    };
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          setProfilePhoto(e.target.result);
        };
        reader.readAsDataURL(file);
        setuploadfile(file);
      }
    };

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
    const [files, setFiles] = useState([])
    const [filesToUpload, setFilesToUpload] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: acceptedFiles => {
        setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
        // Store files to be uploaded in another constant
        setFilesToUpload([...filesToUpload, ...acceptedFiles]);
      }
    })
    const renderFilePreview = file => {
      if (file.type.startsWith('image')) {
        return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
      } else {
        return <FileText size='28' />
      }
    }
    const fileList = files.map((file, index) => (
      <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
        <div className='file-details d-flex align-items-center'>
          <div className='file-preview me-1'>{renderFilePreview(file)}</div>
          <div>
            <p className='file-name mb-0'>{file.name}</p>
          </div>
        </div>
        <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
          <X size={14} />
        </Button>
      </ListGroupItem>
    ))
    const handleRemoveFile = file => {
      const uploadedFiles = files
      const filtered = uploadedFiles.filter(i => i.name !== file.name)
      setFiles([...filtered])
    }

    const handleRemoveAllFiles = () => {
      setFiles([])
    }
    const colorOptions = [
      { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
      { value: 'blue', label: 'Blue', color: '#0052CC', isFixed: true },
      { value: 'purple', label: 'Purple', color: '#5243AA', isFixed: true },
      { value: 'red', label: 'Red', color: '#FF5630', isFixed: false },
      { value: 'orange', label: 'Orange', color: '#FF8B00', isFixed: false },
      { value: 'yellow', label: 'Yellow', color: '#FFC400', isFixed: false }
    ]
    const groupedOptions = [
      {
        options: aadharlist
      }
    ]    
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
                value={value}
                onChange={e => handleFilter(e.target.value)}
                placeholder='Search Invoice'
              />
            </div>
            <Button color='primary' onClick={() => setShow(true)}>
              New Slip
            </Button>
          </Col>
          <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
              <div className='text-center mb-2'>
                <h1 className='mb-1'>New Slip</h1>
              </div>
              <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col sm='12' md='12' xl='12'>
                    <Row>
                      <Col md={4} xs={4} className='py-2'>
                        <Label className='form-label' for='status'>
                          Party Aadhar Number
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
                      <Col md={4} xs={4} className='py-2'>
                        <Label className='form-label' for='productname'>
                          Party Name
                        </Label>
                        <input
                          type='text'
                          readOnly
                          name='partyaadharnumber' // Add a name prop to match your form structure if needed
                          id='partyaadharnumber'
                          placeholder=''
                          className='custom-input-class form-control'
                          style={{ fontSize: '16px' }}
                          value={partyname}
                        />
                      </Col>
                      <Col md={4} xs={4} className='py-2'>
                        <Label className='form-label' for='productprice'>
                          Party Phone Number
                        </Label>
                        <input
                          type='text'
                          readOnly
                          name='partyaadharnumber' // Add a name prop to match your form structure if needed
                          id='partyaadharnumber'
                          placeholder=''
                          className='custom-input-class form-control'
                          style={{ fontSize: '16px' }}
                          value={partyphonenumber}
                        />
                      </Col>

                      <Col md={6} xs={6} className='py-2'>
                        <Label className='form-label' for='productname'>
                          Party Address
                        </Label>
                        <input
                        readOnly
                          type='text'
                          name='partyaadharnumber' // Add a name prop to match your form structure if needed
                          id='partyaadharnumber'
                          placeholder=''
                          className='custom-input-class form-control'
                          style={{ fontSize: '16px' }}
                        value={partyaddress}
                        />

                      </Col>
                      <Col md={6} xs={6} className='py-2'>
                        <Label className='form-label' for='productname'>
                          Remarks
                        </Label>
                        <input
                        readOnly
                          type='text'
                          name='partyaadharnumber' // Add a name prop to match your form structure if needed
                          id='partyaadharnumber'
                          placeholder=''
                          className='custom-input-class form-control'
                          style={{ fontSize: '16px' }}
                          value={reamak}
                        />
                      </Col>
                    </Row>
                  </Col>

                </Row>
                <Row>
                  <Col md={6} xs={6} className='py-2'>
                    <Label className='form-label' for='productprice'>
                      TR No
                    </Label>
                    <input
                      type='text'
                      name='partyaadharnumber' // Add a name prop to match your form structure if needed
                      id='partyaadharnumber'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                    value={trno}
                    onChange={(e) => settrno(e.target.value)}
                    />
                  </Col>
                  <Col md={6} xs={6} className='py-2'>
                    <Label className='form-label' for='productprice'>
                      Type of Material
                    </Label>
                    <input
                      type='text'
                      name='partyaadharnumber' // Add a name prop to match your form structure if needed
                      id='partyaadharnumber'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                    value={typeofmaterial}
                    onChange={(e) => settypeofmaterial(e.target.value)}
                    />
                  </Col>
                  <Col md={6} xs={6} className='py-2'>
                    <Label className='form-label' for='productprice'>
                      Vehicle No
                    </Label>
                    <input
                      type='text'
                      name='partyaadharnumber' // Add a name prop to match your form structure if needed
                      id='partyaadharnumber'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                    value={vehicleno}
                    onChange={(e) => setvehicleno(e.target.value)}
                    />
                  </Col>
                  <Col md={6} xs={6} className='py-2'>
                    <Label className='form-label' for='productprice'>
                      Gross Weight
                    </Label>
                    <input
                      type='text'
                      name='partyaadharnumber' // Add a name prop to match your form structure if needed
                      id='partyaadharnumber'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                    value={grossweight}
                    onChange={(e) => setgrossweight(e.target.value)}
                    />
                  </Col>
                  <Col md={6} xs={6} className='py-2'>
                    <Label className='form-label' for='productprice'>
                      Date & Time In
                    </Label>
                    <Flatpickr
                      value={pickerin}
                      data-enable-time
                      id='date-time-picker'
                      className='form-control'
                      onChange={date => setPickerin(date)}
                    />
                  </Col>
                  <Col md={6} xs={6} className='py-2'>
                    <Label className='form-label' for='productprice'>
                    Date & Time Out
                    </Label>
                    <Flatpickr
                        value={pickerout}
                        data-enable-time
                        id='date-time-picker'
                        className='form-control'
                        onChange={date => setPickerout(date)}
                      />
                  </Col>
                  <Col md={6} xs={6} className='py-2'>
                    <Label className='form-label' for='productprice'>
                      Tare Weight
                    </Label>
                    <input
                      type='text'
                      name='partyaadharnumber' // Add a name prop to match your form structure if needed
                      id='partyaadharnumber'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                    value={tareweight}
                    onChange={(e) => settareweight(e.target.value)}
                    />
                  </Col>
                  <Col md={6} xs={6} className='py-2'>
                    <Label className='form-label' for='productprice'>
                      Net Weight
                    </Label>
                    <input
                      type='text'
                      name='partyaadharnumber' // Add a name prop to match your form structure if needed
                      id='partyaadharnumber'
                      placeholder=''
                      className='custom-input-class form-control'
                      style={{ fontSize: '16px' }}
                    value={netweight}
                    onChange={(e) => setnetweight(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row>

                </Row>
                <Col xs={12} className='text-center mt-2 pt-50'>
                  <Button type='submit' className='me-1' color='primary'>
                    Submit
                  </Button>
                  <Button type='reset' color='secondary' outline onClick={() => setShow(false)}>
                    Discard
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </Row>
      </div>
    )
  }
  // ** States
  const [value, setValue] = useState('');
  const [sort, setSort] = useState('desc');
  const [sortColumn, setSortColumn] = useState('id');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fetchedData, setFetchedData] = useState([]); // New state to hold fetched data
  const [categoryid, setcategoryid] = useState("");
  const fileInputRef = useRef(null);
  const [iscustom, setiscustom] = useState(0)
  const sizeOptions = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'XXXL', label: 'XXXL' },
    { value: 'custom', label: 'Custom' },
  ];
  const handleSizeChange = (selectedOptions) => {
    for (let x in selectedOptions) {
      if (selectedOptions[x].value == 'custom') {
        setiscustom(1);
      }
      else {
        setiscustom(0);
        setSelectedSizes(selectedOptions);
      }
    }
    setSelectedSizes(selectedOptions);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
      // Store files to be uploaded in another constant
      setFilesToUpload([...filesToUpload, ...acceptedFiles]);
    }
  })
  const fetchData = async () => {
    try {
      const response = await fetch(local_api_url + `slip_list`, {
        method: 'GET',
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

  const handleFilter = val => {
    setValue(val);
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
  function deleteproduct(id) {
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
        fetch(api_url + 'deleteproduct/' + id, {
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
            console.error('Error deleting product:', error);
          });
      }
    });
  }
  const CustomPagination = () => {
    const count = Number((fetchedData.total / rowsPerPage).toFixed(0));
    return (
      <ReactPaginate
        nextLabel=''
        breakLabel='...'
        previousLabel=''
        pageCount={count || 1}
        activeClassName='active'
        breakClassName='page-item'
        pageClassName={'page-item'}
        breakLinkClassName='page-link'
        nextLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousLinkClassName={'page-link'}
        previousClassName={'page-item prev'}
        onPageChange={page => handlePagination(page)}
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        containerClassName={'pagination react-paginate justify-content-end p-1'}
      />
    )
  };
  const columns = [
    {
      name: 'ID',
      sortable: true,
      sortField: 'id',
      minWidth: '50px',
      cell: (row, key) => {
        const keyToDisplay = key; // Use the provided key directly
        return <Link to={app_url + `/viewproduct/${row.id}`}>#{keyToDisplay + 1}</Link>
      }
    },
    {
      name: 'Aadhar No',
      sortable: true,
      minWidth: '150px',
      sortField: 'category.name',
      // selector: row => row.client.name,
      cell: row => {
        const name = row.aadhar_no ? row.aadhar_no : 'John Doe';
        return (
          <div className='d-flex justify-content-center align-items-center'>
            {/* renderClient(row) - Not sure what renderClient does */}
            <div className='d-flex flex-column'>
              <h6 className='user-name text-truncate mb-0'>{row.aadhar_no}</h6>
            </div>
          </div>
        );
      }
    },
    {
      name: 'Supplier Name',
      sortable: true,
      minWidth: '200px',
      sortField: 'pname.name',
      // selector: row => row.client.name,
      cell: row => {
        const name = row.name ? row.name : 'John Doe';
        return (
          <div className='d-flex justify-content-center align-items-center'>
            {/* renderClient(row) - Not sure what renderClient does */}
            <div className='d-flex flex-column'>
              <h6 className='user-name text-truncate mb-0'>{row.name}</h6>
            </div>
          </div>
        );
      }
    },
    {
      name: 'TRNo',
      sortable: true,
      minWidth: '150px',
      sortField: 'pname.name',
      // selector: row => row.client.name,
      cell: row => {
        const price = row.trno ? row.trno : 'price';
        return (
          <div className='d-flex justify-content-center align-items-center'>
            {/* renderClient(row) - Not sure what renderClient does */}
            <div className='d-flex flex-column'>
              <h6 className='user-name text-truncate mb-0'>{row.trno}</h6>
            </div>
          </div>
        );
      }
    },
    {
      name: 'Vehicle No',
      sortable: true,
      minWidth: '150px',
      sortField: 'pphoto.name',
      // selector: row => row.client.name,
      cell: row => {
        const price = row.vehicleno ? row.vehicleno : 'price';
        return (
          <div className='d-flex justify-content-center align-items-center'>
            {/* renderClient(row) - Not sure what renderClient does */}
            <div className='d-flex flex-column'>
              <h6 className='user-name text-truncate mb-0'>{row.vehicleno}</h6>
            </div>
          </div>
        );
      }
    },
    {
      name: 'Action',
      minWidth: '50px',
      cell: row => (
        <div className='column-action d-flex align-items-center'>
          {/* <Copy onClick={() => duplicateproduct(row.id)} className='me-2 me-50 cursor-pointer' size={15} />
          <Link to={app_url + `/viewproduct/${row.id}`}><Eye size={15} /></Link>
          <Edit onClick={() => editbutton(row.id)} className='me-50 mx-2 cursor-pointer' size={15} />
          <Trash onClick={e => { deleteproduct(row.id) }} className='me-50 mx-2 cursor-pointer' size={15} /> */}
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
          return item.name.includes(filters.q);
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
  const [productData, setProductData] = useState(null);
  const [catOptions, setcatOptions] = useState([
    { value: "", label: "" },
  ]);
  useEffect(() => {
    fetchcategory()
  }, []);
  const fetchcategory = () => {
    fetch(api_url + 'categorylist').then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then((data) => {
      let arrissue = [];
      if (data.length > 0) {
        for (let x in data) {
          if (x == 0) {
            setcategoryid(data[x].id)
          }
          let obj = { value: data[x].id, label: data[x].name };
          arrissue.push(obj);
        }
      }
      setcatOptions(arrissue);
    })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
  function editbutton(id) {
    setisduplicate(0)
    fetch(api_url + 'viewproduct/' + id, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setFiles(data.featuresimages)
        setuploadfile(data.pdata.image)
        setProfilePhoto(api_assets_url + "uploads/" + data.pdata.image)
        setProductName(data.pdata.pname)
        setCategory(data.pdata.categoryid)
        setoprice(data.pdata.oprice)
        setsprice(data.pdata.sprice)
        setbdescription(data.pdata.bdescription)
        setddescription(data.pdata.ddescription)
        setmetatitle(data.pdata.metatitle)
        setmetades(data.pdata.metades)
        setshowmetaimage(api_assets_url + "uploads/" + data.pdata.metaimage)
        setmetaimage(data.pdata.metaimage)
        setupid(data.pdata.id)
        setProductData(data.pdata)
        for (let x in data.selectedsizes) {
          if (data.selectedsizes[x].value == 'custom') {
            setiscustom(1);
          }
          else {
            setiscustom(0);
            setSelectedSizes(data.selectedsizes);
          }
          setSelectedSizes(data.selectedsizes);
        }
        setSlength(data.pdata.slength)
        setArmhole(data.pdata.armhole)
        setChest(data.pdata.chest)
        setupdateshow(true)
      })
  }
  function duplicateproduct(id) {
    setisduplicate(1)
    fetch(api_url + 'viewproduct/' + id, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        setFiles(data.featuresimages)
        setuploadfile(data.pdata.image)
        setProfilePhoto(api_assets_url + "uploads/" + data.pdata.image)
        setProductName(data.pdata.pname)
        setCategory(data.pdata.categoryid)
        setoprice(data.pdata.oprice)
        setsprice(data.pdata.sprice)
        setbdescription(data.pdata.bdescription)
        setddescription(data.pdata.ddescription)
        setmetatitle(data.pdata.metatitle)
        setmetades(data.pdata.metades)
        setshowmetaimage(api_assets_url + "uploads/" + data.pdata.metaimage)
        setmetaimage(data.pdata.metaimage)
        setupid(data.pdata.id)
        setProductData(data.pdata)
        for (let x in data.selectedsizes) {
          if (data.selectedsizes[x].value == 'custom') {
            setiscustom(1);
          }
          else {
            setiscustom(0);
            setSelectedSizes(data.selectedsizes);
          }
          setSelectedSizes(data.selectedsizes);
        }
        setSlength(data.pdata.slength)
        setArmhole(data.pdata.armhole)
        setChest(data.pdata.chest)
        setupdateshow(true)
      })
  }
  const [isduplicate, setisduplicate] = useState(0);
  const [updateshow, setupdateshow] = useState(false);
  const [upid, setupid] = useState();
  const [category, setCategory] = useState();
  const [productName, setProductName] = useState('');
  const [oprice, setoprice] = useState('');
  const [sprice, setsprice] = useState('');
  const [bdescription, setbdescription] = useState('');
  const [ddescription, setddescription] = useState('');
  const [metatitle, setmetatitle] = useState("");
  const [metades, setmetades] = useState("");
  const [showmetaimage, setshowmetaimage] = useState(null);
  const [metaimage, setmetaimage] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [files, setFiles] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [description, setDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [image, setuploadfile] = useState([]);
  const [slength, setSlength] = useState('');
  const [armhole, setArmhole] = useState('');
  const [chest, setChest] = useState('');
  const handleFileChangemeta = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setshowmetaimage(e.target.result);
      };
      reader.readAsDataURL(file);
      setmetaimage(file);
    }
  };
  const handleSubmit = (e) => {
    setupdateshow(false)
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('supply_id', isduplicate);
    formdata.append('upid', upid);
    formdata.append('upid', upid);
    formdata.append('upid', upid);
    formdata.append('upid', upid);
    formdata.append('upid', upid);
    formdata.append('upid', upid);
    formdata.append('upid', upid);
    formdata.append('upid', upid);
    formdata.append('upid', upid);
    formdata.append('upid', upid);
    fetch(api_url + 'addproduct', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(data => {
        // Check if the upload was successful based on your API response
        if (data) {
          console.log(data)
          if (isduplicate == 1) {
            // Display a success toast that auto-closes after 3 seconds
            toast.success('Duplicated successfully', {
              duration: 3000, // 3000 milliseconds (3 seconds)
            });
          } else {
            // Display a success toast that auto-closes after 3 seconds
            toast.success('Updated successfully', {
              duration: 3000, // 3000 milliseconds (3 seconds)
            });
          }
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setProfilePhoto(e.target.result);
      };
      reader.readAsDataURL(file);
      setuploadfile(file);
    }
  };
  const handleRemoveAllFiles = () => {
    setFiles([]);
  };
  const renderFilePreview = (file) => {
    if (file && file.type && file.type.startsWith('image')) {
      return (
        <img
          className='rounded'
          alt={file.name}
          src={URL.createObjectURL(file)}
          height='28'
          width='28'
        />
      );
    } else if (file && file.name) {
      return (
        <img
          className='rounded'
          alt={file.name}
          src={api_assets_url + 'uploads/' + file.name}
          height='28'
          width='28'
        />
      );
    } else {
      return <FileText size='28' />;
    }

    // Handle the case when 'file' doesn't exist or 'file.type' is not an image
    return null; // or a different component/rendering if needed
  };
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
  const fileInputRefmeta = useRef(null);
  useEffect(() => {
    if (fileInputRefmeta.current) {
      fileInputRefmeta.current.addEventListener('change', handleFileChange);
    }
  }, [fileInputRefmeta]);
  const handleCardClickmeta = () => {
    if (fileInputRefmeta.current) {
      fileInputRefmeta.current.click(); // Trigger the click event on the file input
    }
  };

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }
  const fileList = files.map((file, index) => (
    <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file.name}</p>
        </div>
      </div>
      <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
        <X size={14} />
      </Button>
    </ListGroupItem>
  ))
  return (
    <div className='invoice-list-wrapper'>
      <Modal isOpen={updateshow} toggle={() => setupdateshow(!updateshow)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setupdateshow(!updateshow)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Update Product</h1>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit}>
            <Row>
              <Col md={6} xs={6} className='py-2'>
                <Col md={12} xs={12} className='py-2'>
                  <Label className='form-label' for='status'>
                    Category
                  </Label>
                  <Select
                    id='status'
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    options={catOptions}
                    theme={selectThemeColors}
                    onChange={(e) => setCategory(e)}
                    defaultValue={
                      productData && productData.categoryid
                        ? {
                          value: productData.categoryid,
                          label: productData.categoryname,
                        }
                        : null
                    }
                  />
                </Col>
                <Col md={12} xs={12} className='py-2'>
                  <Label className='form-label' for='productname'>
                    Product Name
                  </Label>
                  <Input
                    id='productname'
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </Col>
                <Row>

                  <Col md={6} xs={6} className='py-2'>
                    <Label className='form-label' for='OriginalPrice'>
                      Original price
                    </Label>
                    <Input
                      id='OriginalPrice'
                      value={oprice}
                      onChange={(e) => setoprice(e.target.value)}
                    />
                  </Col>
                  <Col md={6} xs={6} className='py-2'>
                    <Label className='form-label' for='saleprice'>
                      Sale price
                    </Label>
                    <Input
                      id='saleprice'
                      value={sprice}
                      onChange={(e) => setsprice(e.target.value)}
                    />
                  </Col>
                </Row>
              </Col>
              <Col sm='6' md='6' xl='6'>
                <Col xs={12}>
                  <div className='d-flex justify-content-center py-2'>
                    {profilePhoto ? (
                      <>

                        <img
                          src={profilePhoto}
                          onClick={handleCardClick}
                          alt="Preview"
                          className='img-fluid'
                          style={{ cursor: 'pointer', height: '270px', width: '350px' }}
                        />
                        <input type='file' ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                      </>

                    ) : (
                      <Card className='py-2 text-center' style={{ cursor: 'pointer', height: '270px', width: '350px' }}>
                        <CardBody onClick={handleCardClick}>
                          <div>
                            <input type='file' ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                            <div className='d-flex align-items-center justify-content-center flex-column'>
                              <DownloadCloud size={64} />
                              <h5>Drop Files here or click to upload</h5>
                              <p className='text-secondary'>
                                Drop files here or click{' '}
                                <a href='/' onClick={(e) => e.preventDefault()}>
                                  browse
                                </a>{' '}
                                thorough your machine
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    )}
                  </div>
                </Col>
              </Col>
            </Row>
            <Row>
              <Col md={6} xs={6} className='py-2'>
                <Label className='form-label' for='productprice'>
                  Brief Description
                </Label>
                <textarea
                  id='bdescription'
                  name='bdescription'
                  placeholder=''
                  value={bdescription} // Assuming you are using a form library like react-hook-form
                  onChange={e => setbdescription(e.target.value)} // Assuming you are using a form library like react-hook-form
                  className={'form-control'}
                />
              </Col>

              <Col md={6} xs={6} className='py-2'>
                <Label className='form-label' for='ddescription'>
                  Detailed Description
                </Label>
                <textarea
                  id='ddescription'
                  name='ddescription'
                  placeholder=''
                  value={ddescription} // Assuming you are using a form library like react-hook-form
                  onChange={e => setddescription(e.target.value)} // Assuming you are using a form library like react-hook-form
                  className={'form-control'}
                />
              </Col>

            </Row>
            <Col sm='12' md='12' xl='12'>
              <Row>
                <Col md={6} xs={6} className='py-2'>
                  <Label className='form-label' for='sizes'>
                    Sizes
                  </Label>
                  <Select
                    id='sizes'
                    isMulti  // Allow multiple selections
                    className='react-select'
                    classNamePrefix='select'
                    options={sizeOptions}  // Define your size options as an array of objects
                    value={selectedSizes}  // Bind the selected sizes to the state variable
                    onChange={handleSizeChange}  // Define a function to handle size selection changes
                  />
                </Col>
                {iscustom == 1 ?

                  <Col md={6} xs={6} className='py-2'>
                    <Label className='form-label' for='sizes'>
                      Custom size (shoulder length, armhole, chest)
                    </Label>

                    <Row>
                      <Col md="4">
                        <Input
                          id='slength'
                          name='slength'
                          value={slength}
                          onChange={(e) => setSlength(e.target.value)}
                        />
                      </Col>
                      <Col md="4">
                        <Input
                          id='armhole'
                          name='armhole'
                          value={armhole}
                          onChange={(e) => setArmhole(e.target.value)}
                        />
                      </Col>
                      <Col md="4">
                        <Input
                          id='chest'
                          name='chest'
                          value={chest}
                          onChange={(e) => setChest(e.target.value)}
                        />
                      </Col>
                    </Row>

                  </Col>
                  :
                  <></>}
                <Col md={6} xs={6} className='py-2'>
                  <Label className='form-label' for='metatitle'>
                    Meta title
                  </Label>
                  <Input
                    id='metatitle'
                    value={metatitle}
                    onChange={(e) => setmetatitle(e.target.value)}
                  />
                </Col>
              </Row>
              <Row>

                <Col md={6} xs={6} className='py-2'>
                  <Label className='form-label' for='productprice'>
                    Meta Description
                  </Label>
                  <Input
                    id='productprice'
                    value={metades}
                    onChange={(e) => setmetades(e.target.value)}
                  />
                </Col>
                <Col md={6} xs={6} className='py-2'>
                  <Label className='form-label' htmlFor='productprice'>
                    Meta Image
                  </Label>
                  {showmetaimage ? (
                    <>

                      <img
                        src={showmetaimage}
                        onClick={handleCardClickmeta}
                        alt="Preview"
                        className='img-fluid'
                        style={{ cursor: 'pointer', height: '270px', width: '350px' }}
                      />
                      <input type='file' ref={fileInputRefmeta} onChange={handleFileChangemeta} style={{ display: 'none' }} />
                    </>

                  ) : (
                    <input ref={fileInputRefmeta} type="file" id='metaimg' onChange={handleFileChangemeta} className="form-control" />
                  )}

                </Col>
              </Row>

            </Col>


            <Col sm='12' md='12' xl='12' className='text-center'>
              <Card>
                <CardHeader>
                  <CardTitle tag='h4'>Multiple</CardTitle>
                </CardHeader>
                <CardBody>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div className='d-flex align-items-center justify-content-center flex-column'>
                      <DownloadCloud size={64} />
                      <h5>Drop Files here or click to upload</h5>
                      <p className='text-secondary'>
                        Drop files here or click{' '}
                        <a href='/' onClick={(e) => e.preventDefault()}>
                          browse
                        </a>{' '}
                        thorough your machine
                      </p>
                    </div>
                  </div>
                  {files.length ? (
                    <Fragment>
                      <ListGroup className='my-2'>{fileList}</ListGroup>
                      <div className='d-flex justify-content-end'>
                        <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                          Remove All
                        </Button>
                      </div>
                    </Fragment>
                  ) : null}
                </CardBody>
              </Card>
            </Col>

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

      <Card>
        <div className='invoice-list-dataTable react-dataTable'>
          <DataTable
            noHeader
            pagination
            sortServer
            paginationServer
            subHeader={true}
            columns={columns}
            responsive={true}
            data={dataToRender()}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            defaultSortField='invoiceId'
            paginationDefaultPage={currentPage}
            paginationComponent={CustomPagination}
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
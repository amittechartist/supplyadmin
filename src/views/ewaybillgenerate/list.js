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
    const [partyaccountnumber, setpartyaccountnumber] = useState([]);
    const [partyifsccode, setpartyifsccode] = useState([]);
    const accountDetails = [];
    accountDetails.push({
      accountNumber: partyaccountnumber,
      ifscCode: partyifsccode,
    });
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
  const [fetchedData, setFetchedData] = useState([]);
  

  
  const printpdf = async (id) => {
    try {
      const response = await fetch(local_api_url + 'pdf_download/' + id, {
        method: 'GET',
        // You can add headers if needed
        responseType: 'blob', // Set responseType to 'blob' to handle binary data
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Check if the response headers contain the filename
      const filename = response.headers.get('content-disposition');
      const match = /filename="(.+)"/.exec(filename);
      const suggestedFilename = match ? match[1] : 'download.pdf';
  
      const blob = await response.blob();
  
      // Create a URL for the blob and initiate the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedFilename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  const fetchData = async () => {
    try {
      const response = await fetch(local_api_url + 'eway_bill_list', {
        method: 'GET',
        // You can add headers if needed
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setFetchedData(data);
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
      minWidth: '30px',
      cell: (row, key) => {
        const keyToDisplay = key; // Use the provided key directly
        
        return(
          <h6 className='user-name text-truncate mb-0'>{`${keyToDisplay + 1}`}</h6>
        )
      }
    },
    {
      name: 'FROM Name',
      sortable: true,
      minWidth: '350px',
      sortField: 'category.name',
      // selector: row => row.client.name,
      cell: row => {
        return (
          <div className='d-flex justify-content-left align-items-center'>
            {/* renderClient(row) - Not sure what renderClient does */}
            <div className='d-flex flex-column'>
              <h6 className='user-name text-truncate mb-0'>{row.from_name}</h6>
            </div>
          </div>
        );
      }
    },
    {
      name: 'To Name',
      sortable: true,
      minWidth: '150px',
      sortField: 'pphoto.name',
      // selector: row => row.client.name,
      cell: row => {
        return (
          <div className='d-flex justify-content-left align-items-center'>
            {/* renderClient(row) - Not sure what renderClient does */}
            <div className='d-flex flex-column'>
              <h6 className='user-name text-truncate mb-0'>{row.to_name}</h6>
            </div>
          </div>
        );
      }
    },
    {
      name: 'Generated Date',
      sortable: true,
      minWidth: '150px',
      sortField: 'pphoto.name',
      // selector: row => row.client.name,
      cell: row => {
        return (
          <div className='d-flex justify-content-left align-items-center'>
            {/* renderClient(row) - Not sure what renderClient does */}
            <div className='d-flex flex-column'>
              <h6 className='user-name text-truncate mb-0'>{row.generated_date}</h6>
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
          {/* <Info onClick={() => { viewdetails(row.id) }} className='cursor-pointer' size={15} /> */}
          <Button onClick={() => printpdf(row.id)}>Print PDF</Button>
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
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api_url,api_assets_url } from '@src/common/Helpers';
import { Button, Input, Row, Col, Card } from 'reactstrap'
import UILoader from '@components/ui-loader';

function Invoice() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [productdataimages, setproductdataimages] = useState([]);
  const [productdatasizes, setproductdatasizes] = useState([]);
  const [productdata, setProductdata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(api_url + 'viewproduct/' + pid)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProductdata(data.pdata);
        setproductdataimages(data.featuresimages);
        setproductdatasizes(data.selectedsizes);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, [pid]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="text-end">
        <button className="btn btn-primary mb-1" onClick={handleGoBack}>
          Go Back
        </button>
      </div>

      <div className="d-flex justify-content-center align-items-center h-100">
        <div style={{ marginTop: '20px' }}>
          <UILoader blocking={isLoading} overlayColor="rgba(115, 103, 240, .1)">
            {productdata ? (

              <Card className="product-preview-card p-3">
              <div className="row g-0">
                <Col md={8}>
                <Row className='d-flex align-items-center'>
                <div className="col-md-6 pt-2">
                  <img
                    src={api_assets_url + 'uploads/' + productdata.image}
                    className="card-img img-fluid rounded"
                    alt="Product Photo"
                  />
                  
                  {productdataimages && productdataimages.length > 0 && (
                    <div>
                      <h6 className="card-text my-1">Features Images:</h6>
                      <div className="row">
                        {productdataimages.map((row, index) => (
                          <div key={index} className="col-md-4 mb-2">
                            <img
                              src={api_assets_url + 'uploads/' + row.name}
                              alt={`Feature Image ${index}`}
                              className="img-fluid rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="card-body pt-0">
                    <h5 className="card-title">{productdata.name}</h5>
                    <p className="card-text">
                      <span className="badge bg-primary">Category: {productdata.categoryname}</span>
                    </p>
                    <p className="card-text">Original Price: ${productdata.oprice}</p>
                    <p className="card-text">Sale Price: ${productdata.sprice}</p>
                    <p className="card-text">
                      Availability: <span className="badge bg-success">In Stock</span>
                    </p>
                    {productdatasizes && productdatasizes.length > 0 && (
                      <p>Sizes: 
                        {productdatasizes.map((row, index) => (
                          <span className='' key={row.value}>
                            {row.value}{index !== productdatasizes.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </p>
                    )}
                    <p className="card-text">Brief Description : {productdata.bdescription}</p>
                    <p className="card-text">Detailed Description : {productdata.ddescription}</p>
                  </div>
                </div>
                </Row>
                </Col>
                <Col md={4}>
                  
              {/* Separate section for displaying meta data */}
              <div className="row g-0">
                <div className="col-md-12">
                  
                <div className="card-body">
                    <p className="card-text">Meta Title: {productdata.metatitle}</p>
                    <p className="card-text">Meta Description: {productdata.metades}</p>
                    <img
                    src={api_assets_url + 'uploads/' + productdata.metaimage}
                    alt={`Meta Image`}
                    className="img-fluid rounded"
                  />
                  </div>
                </div>
              </div>
                </Col>
              </div>
            </Card>
            
            
            ) : null}
          </UILoader>
        </div>
      </div>
    </div>
  );
}

export default Invoice;

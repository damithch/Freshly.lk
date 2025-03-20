import React, { useState } from 'react';
import { Row, Col, Button, Table, Card, Nav, Form, InputGroup, Badge, ProgressBar } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaUser, FaShoppingBag, FaSearch, FaTruck, FaBox, FaHome, FaQuestionCircle, FaHeart } from 'react-icons/fa';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import ProfileForm from '../components/ProfileForm';
import { addCurrency } from '../utils/addCurrency';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  // Filter orders based on search term
  const filteredOrders = orders ? orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(order.createdAt).toLocaleDateString().includes(searchTerm)
  ) : [];

  // Get active orders (paid but not delivered)
  const activeOrders = orders ? orders.filter(order => 
    order.isPaid && !order.isDelivered
  ) : [];

  // Helper function to determine order progress percentage
  const getOrderProgress = (order) => {
    if (!order.isPaid) return 0;
    if (order.isDelivered) return 100;
    
    // Estimate progress based on time elapsed
    const orderDate = new Date(order.paidAt || order.createdAt);
    const estimatedDeliveryTime = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
    const currentTime = new Date().getTime();
    const elapsed = currentTime - orderDate.getTime();
    
    return Math.min(Math.round((elapsed / estimatedDeliveryTime) * 100), 90);
  };

  // Helper function to get tracking status text
  const getTrackingStatus = (progress) => {
    if (progress === 0) return 'Processing';
    if (progress < 25) return 'Confirmed';
    if (progress < 50) return 'Packaged';
    if (progress < 75) return 'Shipped';
    if (progress < 100) return 'Out for delivery';
    return 'Delivered';
  };

  return (
    <>
      <Meta title='User Profile' />
      <Row className='mt-4'>
        <Col md={3}>
          <Card className='shadow-sm'>
            {/* Top Section of Sidebar */}
            <Card.Header className="bg-primary text-white text-center py-3">
              <h5 className="mb-0">Dashboard</h5>
            </Card.Header>
            
            <Nav variant='pills' className='flex-column p-2'>
              {/* Main Navigation Options */}
              <Nav.Item>
                <Nav.Link href="/" className="d-flex align-items-center">
                  <FaHome className='me-2' />Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
                  <FaShoppingBag className='me-2' />Order History
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'tracking'} onClick={() => setActiveTab('tracking')}>
                  <FaTruck className='me-2' />Track Orders
                  {activeOrders.length > 0 && (
                    <Badge bg="primary" pill className="ms-2">
                      {activeOrders.length}
                    </Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/wishlist">
                  <FaHeart className='me-2' />Wishlist
                </Nav.Link>
              </Nav.Item>
              
              {/* Divider */}
              <hr className="my-2" />
              
              {/* Bottom Navigation Options */}
              <Nav.Item>
                <Nav.Link href="/help">
                  <FaQuestionCircle className='me-2' />Help & Support
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
                  <FaUser className='me-2' />My Profile
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            {/* Bottom Section of Sidebar */}
            <Card.Footer className="bg-light text-center py-2">
              <small className="text-muted">© 2025 MyShop</small>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={9}>
          <Card className='p-3 shadow-sm'>
            {activeTab === 'profile' && (
              <>
                <h3 className='text-center mb-3'>My Profile</h3>
                <ProfileForm />
              </>
            )}

            {activeTab === 'orders' && (
              <>
                <h3 className='mb-3'>Order History</h3>
                
                {/* Search Function */}
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by order ID or date..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setSearchTerm('')}
                    >
                      Clear
                    </Button>
                  )}
                </InputGroup>

                {isLoading ? (
                  <Loader />
                ) : error ? (
                  <Message variant='danger'>
                    {error?.data?.message || error.error}
                  </Message>
                ) : orders.length > 0 ? (
                  <>
                    {filteredOrders.length > 0 ? (
                      <Table striped bordered hover responsive className='text-center'>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Total (Rs.)</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map(order => (
                            <tr key={order._id}>
                              <td>{order._id.substring(0, 8)}</td>
                              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td>{addCurrency(order.totalPrice)}</td>
                              <td>
                                {order.isPaid ? (
                                  <FaCheckCircle color='green' />
                                ) : (
                                  <FaTimesCircle color='red' />
                                )}
                              </td>
                              <td>
                                {order.isDelivered ? (
                                  <FaCheckCircle color='green' />
                                ) : (
                                  <FaTimesCircle color='red' />
                                )}
                              </td>
                              <td>
                                <LinkContainer to={`/order/${order._id}`}>
                                  <Button variant='primary' size='sm'>
                                    View
                                  </Button>
                                </LinkContainer>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <Message variant='info'>No matching orders found.</Message>
                    )}
                  </>
                ) : (
                  <Message variant='info'>You have no orders yet.</Message>
                )}
              </>
            )}

            {activeTab === 'tracking' && (
              <>
                <h3 className='mb-3'>Track Orders</h3>
                {isLoading ? (
                  <Loader />
                ) : error ? (
                  <Message variant='danger'>
                    {error?.data?.message || error.error}
                  </Message>
                ) : activeOrders.length > 0 ? (
                  activeOrders.map(order => (
                    <Card key={order._id} className="mb-3 shadow-sm">
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-0">Order #{order._id.substring(0, 8)}</h5>
                          <small className="text-muted">
                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button variant='outline-primary' size='sm'>
                            View Details
                          </Button>
                        </LinkContainer>
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Status: <strong>{getTrackingStatus(getOrderProgress(order))}</strong></span>
                            <span>Total: <strong>{addCurrency(order.totalPrice)}</strong></span>
                          </div>
                          <ProgressBar 
                            now={getOrderProgress(order)} 
                            label={`${getOrderProgress(order)}%`} 
                            variant="success" 
                            className="mt-2"
                          />
                        </div>
                        
                        <div className="d-flex justify-content-between flex-wrap mt-3">
                          <div className="tracking-step text-center">
                            <FaBox color={getOrderProgress(order) >= 25 ? "green" : "gray"} size={20} />
                            <div className="small mt-1">Processing</div>
                          </div>
                          <div className="tracking-step text-center">
                            <FaBox color={getOrderProgress(order) >= 50 ? "green" : "gray"} size={20} />
                            <div className="small mt-1">Shipped</div>
                          </div>
                          <div className="tracking-step text-center">
                            <FaTruck color={getOrderProgress(order) >= 75 ? "green" : "gray"} size={20} />
                            <div className="small mt-1">In Transit</div>
                          </div>
                          <div className="tracking-step text-center">
                            <FaCheckCircle color={order.isDelivered ? "green" : "gray"} size={20} />
                            <div className="small mt-1">Delivered</div>
                          </div>
                        </div>
                        
                        {order.shippingAddress && (
                          <div className="mt-3 pt-3 border-top">
                            <small className="text-muted d-block">Shipping to:</small>
                            <div>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</div>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Message variant='info'>
                    <div className="text-center py-3">
                      <FaTruck size={40} className="mb-3 text-muted" />
                      <h5>No Active Orders to Track</h5>
                      <p>All your orders have been delivered or are waiting for payment.</p>
                      <LinkContainer to='/'>
                        <Button variant="primary">Continue Shopping</Button>
                      </LinkContainer>
                    </div>
                  </Message>
                )}
              </>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProfilePage;
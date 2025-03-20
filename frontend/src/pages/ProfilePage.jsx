import React, { useState } from 'react';
import { Row, Col, Button, Table, Card, Nav, Form, InputGroup, Badge, ProgressBar } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaUser, FaShoppingBag, FaSearch, FaTruck, FaBox, FaHome, FaQuestionCircle, FaList, FaChartBar, FaRegClock } from 'react-icons/fa';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import ProfileForm from '../components/ProfileForm';
import { addCurrency } from '../utils/addCurrency';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
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

  // Get completed orders
  const completedOrders = orders ? orders.filter(order => 
    order.isDelivered
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
      <div className='d-flex'>
        {/* Sidebar - Using position fixed but with a specific top offset */}
        <div 
          className="d-flex flex-column" 
          style={{ 
            width: '250px',
            position: 'fixed',
            top: '56px', // Added top offset to account for main navigation bar (adjust this value based on your header height)
            left: 0,
            bottom: 0,
            backgroundColor: '#1B5E20', 
            color: 'white',
            zIndex: 1000,
            overflowY: 'auto' // Allow scrolling if the sidebar content is too long
          }}
        >
          {/* Logo section */}
          <div className="p-4 border-bottom text-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <h3 className="fw-bold mb-0" style={{ color: 'white' }}>MyShop</h3>
          </div>
          
          {/* Navigation Menu */}
          <Nav className="flex-column pt-3">
            <Nav.Item>
              <Nav.Link 
                onClick={() => setActiveTab('dashboard')} 
                className="d-flex align-items-center ps-4 py-3 border-start border-3"
                style={{ 
                  borderLeftColor: activeTab === 'dashboard' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'dashboard' ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                  backgroundColor: activeTab === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                <FaHome className='me-3' />
                <span className="fw-medium">Dashboard</span>
              </Nav.Link>
            </Nav.Item>
            
            <Nav.Item>
              <Nav.Link 
                onClick={() => setActiveTab('orders')} 
                className="d-flex align-items-center ps-4 py-3 border-start border-3"
                style={{ 
                  borderLeftColor: activeTab === 'orders' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'orders' ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                  backgroundColor: activeTab === 'orders' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                <FaList className='me-3' />
                <span className="fw-medium">All Orders</span>
              </Nav.Link>
            </Nav.Item>
            
            <Nav.Item>
              <Nav.Link 
                onClick={() => setActiveTab('tracking')} 
                className="d-flex align-items-center ps-4 py-3 border-start border-3"
                style={{ 
                  borderLeftColor: activeTab === 'tracking' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'tracking' ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                  backgroundColor: activeTab === 'tracking' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                <FaRegClock className='me-3' />
                <span className="fw-medium">Pending</span>
                {activeOrders.length > 0 && (
                  <Badge bg="light" text="dark" pill className="ms-2">
                    {activeOrders.length}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
            
            <Nav.Item>
              <Nav.Link 
                onClick={() => setActiveTab('completed')}
                className="d-flex align-items-center ps-4 py-3 border-start border-3"
                style={{ 
                  borderLeftColor: activeTab === 'completed' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'completed' ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                  backgroundColor: activeTab === 'completed' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                <FaCheckCircle className='me-3' />
                <span className="fw-medium">Resolved</span>
              </Nav.Link>
            </Nav.Item>
            
            <Nav.Item>
              <Nav.Link 
                onClick={() => setActiveTab('profile')}
                className="d-flex align-items-center ps-4 py-3 border-start border-3"
                style={{ 
                  borderLeftColor: activeTab === 'profile' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'profile' ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                  backgroundColor: activeTab === 'profile' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                <FaUser className='me-3' />
                <span className="fw-medium">Users</span>
              </Nav.Link>
            </Nav.Item>
            
            <Nav.Item>
              <Nav.Link 
                onClick={() => setActiveTab('reports')}
                className="d-flex align-items-center ps-4 py-3 border-start border-3"
                style={{ 
                  borderLeftColor: activeTab === 'reports' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'reports' ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                  backgroundColor: activeTab === 'reports' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                <FaChartBar className='me-3' />
                <span className="fw-medium">Reports</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          
          <div className="mt-auto p-3 small text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>
            © 2025 MyShop
          </div>
        </div>

        {/* Main content area with offset for sidebar and main navbar */}
        <div style={{ 
          marginLeft: '250px', 
          width: 'calc(100% - 250px)',
          marginTop: '56px', // Add top margin to account for the main navbar
          minHeight: 'calc(100vh - 56px)' // Set minimum height to ensure content fills the viewport
        }}>
          <div className="p-4">
            {/* Search bar at the top */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="search-container" style={{ width: '100%' }}>
                <InputGroup>
                  <Form.Control
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="py-2"
                  />
                  <InputGroup.Text className="bg-success text-white">
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <>
                <h4 className='mb-4'>Dashboard Overview</h4>
                
                {/* Stats cards row */}
                <Row className="mb-4 g-3">
                  <Col md={3}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                        <FaShoppingBag className="mb-3 text-success" size={24} />
                        <h6 className="text-muted">Total Orders</h6>
                        <h2 className="mb-0">{orders ? orders.length : 0}</h2>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                        <FaRegClock className="mb-3 text-success" size={24} />
                        <h6 className="text-muted">Pending</h6>
                        <h2 className="mb-0">{activeOrders ? activeOrders.length : 0}</h2>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                        <FaCheckCircle className="mb-3 text-success" size={24} />
                        <h6 className="text-muted">Resolved</h6>
                        <h2 className="mb-0">
                          {orders ? orders.filter(order => order.isDelivered).length : 0}
                        </h2>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                        <FaTruck className="mb-3 text-success" size={24} />
                        <h6 className="text-muted">Avg. Delivery</h6>
                        <h2 className="mb-0">3d</h2>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Recent activity section */}
                <Card className='border-0 shadow-sm p-4 mb-4'>
                  <h5 className='mb-3'>Recent Activity</h5>
                  {isLoading ? (
                    <Loader />
                  ) : error ? (
                    <Message variant='danger'>
                      {error?.data?.message || error.error}
                    </Message>
                  ) : orders && orders.length > 0 ? (
                    <Table responsive borderless hover className='align-middle'>
                      <thead className="bg-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order._id}>
                            <td>#{order._id.substring(0, 8)}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>{addCurrency(order.totalPrice)}</td>
                            <td>
                              {order.isDelivered ? (
                                <Badge bg="success" pill>Delivered</Badge>
                              ) : order.isPaid ? (
                                <Badge bg="info" pill>Processing</Badge>
                              ) : (
                                <Badge bg="warning" text="dark" pill>Pending</Badge>
                              )}
                            </td>
                            <td>
                              <LinkContainer to={`/order/${order._id}`}>
                                <Button variant='outline-success' size='sm' className="rounded-pill">
                                  View
                                </Button>
                              </LinkContainer>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Message variant='info'>No recent activity.</Message>
                  )}
                </Card>

                {/* Quick stats section */}
                <Row className="g-3">
                  <Col md={6}>
                    <Card className='border-0 shadow-sm h-100'>
                      <Card.Body>
                        <h5 className='mb-3'>Pending Orders</h5>
                        {activeOrders.length > 0 ? (
                          <div className="d-flex flex-column">
                            {activeOrders.slice(0, 3).map(order => (
                              <div className="d-flex justify-content-between align-items-center mb-3 p-2 border-bottom" key={order._id}>
                                <div>
                                  <p className="mb-0 fw-medium">#{order._id.substring(0, 8)}</p>
                                  <small className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</small>
                                </div>
                                <div className="text-end">
                                  <p className="mb-0 fw-bold">{addCurrency(order.totalPrice)}</p>
                                  <small className="text-info">{getTrackingStatus(getOrderProgress(order))}</small>
                                </div>
                              </div>
                            ))}
                            {activeOrders.length > 3 && (
                              <p className="text-center mb-0 mt-2">
                                <Button 
                                  variant="link" 
                                  className="text-success p-0"
                                  onClick={() => setActiveTab('tracking')}
                                >
                                  View all {activeOrders.length} pending orders
                                </Button>
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted">No pending orders.</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className='border-0 shadow-sm h-100'>
                      <Card.Body>
                        <h5 className='mb-3'>Recently Completed</h5>
                        {completedOrders.length > 0 ? (
                          <div className="d-flex flex-column">
                            {completedOrders.slice(0, 3).map(order => (
                              <div className="d-flex justify-content-between align-items-center mb-3 p-2 border-bottom" key={order._id}>
                                <div>
                                  <p className="mb-0 fw-medium">#{order._id.substring(0, 8)}</p>
                                  <small className="text-muted">Delivered: {new Date(order.deliveredAt).toLocaleDateString()}</small>
                                </div>
                                <div className="text-end">
                                  <p className="mb-0 fw-bold">{addCurrency(order.totalPrice)}</p>
                                  <Badge bg="success" pill>Completed</Badge>
                                </div>
                              </div>
                            ))}
                            {completedOrders.length > 3 && (
                              <p className="text-center mb-0 mt-2">
                                <Button 
                                  variant="link" 
                                  className="text-success p-0"
                                  onClick={() => setActiveTab('completed')}
                                >
                                  View all {completedOrders.length} completed orders
                                </Button>
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted">No completed orders.</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}

            {/* Main content area */}
            {activeTab !== 'dashboard' && (
              <Card className='border-0 shadow-sm p-4'>
                {activeTab === 'profile' && (
                  <>
                    <h4 className='mb-4'>User Profile</h4>
                    <ProfileForm />
                  </>
                )}

                {activeTab === 'orders' && (
                  <>
                    <h4 className='mb-4'>Order History</h4>

                    {isLoading ? (
                      <Loader />
                    ) : error ? (
                      <Message variant='danger'>
                        {error?.data?.message || error.error}
                      </Message>
                    ) : orders.length > 0 ? (
                      <>
                        {filteredOrders.length > 0 ? (
                          <Table responsive borderless hover className='align-middle'>
                            <thead className="bg-light">
                              <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOrders.map(order => (
                                <tr key={order._id}>
                                  <td>#{order._id.substring(0, 8)}</td>
                                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                  <td>{addCurrency(order.totalPrice)}</td>
                                  <td>
                                    {order.isPaid ? (
                                      <Badge bg="success" pill>Paid</Badge>
                                    ) : (
                                      <Badge bg="warning" text="dark" pill>Pending</Badge>
                                    )}
                                  </td>
                                  <td>
                                    {order.isDelivered ? (
                                      <Badge bg="success" pill>Delivered</Badge>
                                    ) : (
                                      <Badge bg="info" pill>Processing</Badge>
                                    )}
                                  </td>
                                  <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                      <Button variant='outline-success' size='sm' className="rounded-pill">
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
                    <h4 className='mb-4'>Pending Orders</h4>
                    {isLoading ? (
                      <Loader />
                    ) : error ? (
                      <Message variant='danger'>
                        {error?.data?.message || error.error}
                      </Message>
                    ) : activeOrders.length > 0 ? (
                      <div className="row g-3">
                        {activeOrders.map(order => (
                          <div className="col-md-6" key={order._id}>
                            <Card className="border-0 shadow-sm mb-0 h-100">
                              <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center pt-3">
                                <div>
                                  <h5 className="mb-0">Order #{order._id.substring(0, 8)}</h5>
                                  <small className="text-muted">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </small>
                                </div>
                                <LinkContainer to={`/order/${order._id}`}>
                                  <Button variant='outline-success' size='sm' className="rounded-pill">
                                    Details
                                  </Button>
                                </LinkContainer>
                              </Card.Header>
                              <Card.Body>
                                <div className="mb-3">
                                  <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Status:</span>
                                    <span className="fw-medium">{getTrackingStatus(getOrderProgress(order))}</span>
                                  </div>
                                  <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Items:</span>
                                    <span className="fw-medium">{order.orderItems.length}</span>
                                  </div>
                                  <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Total:</span>
                                    <span className="fw-bold">{addCurrency(order.totalPrice)}</span>
                                  </div>
                                  <ProgressBar 
                                    now={getOrderProgress(order)} 
                                    variant="success" 
                                    className="mt-2"
                                    style={{ height: "8px" }}
                                  />
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <FaTruck size={48} className="mb-3 text-muted opacity-50" />
                        <h5>No Pending Orders</h5>
                        <p className="text-muted">All your orders have been delivered or are waiting for payment.</p>
                        <LinkContainer to='/'>
                          <Button variant="success" className="rounded-pill px-4 mt-2">
                            Continue Shopping
                          </Button>
                        </LinkContainer>
                      </div>
                    )}
                  </>
                )}
                
                {activeTab === 'completed' && (
                  <>
                    <h4 className='mb-4'>Completed Orders</h4>
                    {isLoading ? (
                      <Loader />
                    ) : error ? (
                      <Message variant='danger'>
                        {error?.data?.message || error.error}
                      </Message>
                    ) : completedOrders.length > 0 ? (
                      <Table responsive borderless hover className='align-middle'>
                        <thead className="bg-light">
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Delivered On</th>
                            <th>Total</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedOrders.map(order => (
                            <tr key={order._id}>
                              <td>#{order._id.substring(0, 8)}</td>
                              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td>{new Date(order.deliveredAt).toLocaleDateString()}</td>
                              <td>{addCurrency(order.totalPrice)}</td>
                              <td>
                                <LinkContainer to={`/order/${order._id}`}>
                                  <Button variant='outline-success' size='sm' className="rounded-pill">
                                    View
                                  </Button>
                                </LinkContainer>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center py-5">
                        <FaCheckCircle size={48} className="mb-3 text-muted opacity-50" />
                        <h5>No Completed Orders</h5>
                        <p className="text-muted">You don't have any completed orders yet.</p>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'reports' && (
                  <>
                    <h4 className='mb-4'>Reports</h4>
                    <div className="text-center py-5">
                      <FaChartBar size={48} className="mb-3 text-success opacity-50" />
                      <h5>Reports Module</h5>
                      <p className="text-muted">The reporting functionality is available in the full version.</p>
                    </div>
                  </>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
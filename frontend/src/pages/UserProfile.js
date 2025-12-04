import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { User, Package, MapPin, Settings, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const UserProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [userProfile, setUserProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Initialize user profile
    setUserProfile({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      postal_code: user.postal_code || ''
    });

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, loading, navigate, activeTab]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Не удалось загрузить заказы');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/me`,
        userProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local storage
      const updatedUser = { ...user, ...userProfile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Профиль успешно обновлен!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Ошибка обновления профиля');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'В обработке', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Подтвержден', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Отправлен', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Доставлен', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Отменен', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-main">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Личный кабинет</h1>
          <p className="text-gray-600">Добро пожаловать, {user.full_name || user.email}!</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-4 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-5 h-5 inline mr-2" />
            Мои заказы
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-4 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-5 h-5 inline mr-2" />
            Личные данные
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-4 px-4 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-5 h-5 inline mr-2" />
            Адреса доставки
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-4 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-5 h-5 inline mr-2" />
            Настройки
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">История заказов</h2>
              <Button onClick={fetchOrders} variant="outline" disabled={loadingOrders}>
                {loadingOrders ? 'Загрузка...' : 'Обновить'}
              </Button>
            </div>

            {loadingOrders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : orders.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">У вас пока нет заказов</h3>
                <p className="text-gray-600 mb-6">Начните покупки и ваши заказы появятся здесь</p>
                <Button onClick={() => navigate('/products')}>
                  Перейти к покупкам
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Заказ #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0"></div>
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-gray-600">Количество: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-semibold">${item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                      <div>
                        <p className="text-sm text-gray-600">Способ доставки</p>
                        <p className="font-medium">{order.delivery_method === 'nova_poshta' ? 'Нова Пошта' : order.delivery_method === 'ukrposhta' ? 'Укрпошта' : 'Самовывоз'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Итого</p>
                        <p className="text-2xl font-bold text-blue-600">${order.total_amount}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Адрес доставки:</p>
                      <p className="font-medium">
                        {order.delivery_address?.city}, {order.delivery_address?.address}
                        {order.delivery_address?.postal_code && `, ${order.delivery_address.postal_code}`}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Личные данные</h2>
            
            <Card className="p-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Полное имя</Label>
                  <Input
                    id="full_name"
                    value={userProfile.full_name}
                    onChange={(e) => setUserProfile({ ...userProfile, full_name: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="+380..."
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  {!isEditing ? (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Редактировать профиль
                    </Button>
                  ) : (
                    <>
                      <Button type="submit">Сохранить изменения</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setUserProfile({
                            full_name: user.full_name || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            address: user.address || '',
                            city: user.city || '',
                            postal_code: user.postal_code || ''
                          });
                        }}
                      >
                        Отменить
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Адреса доставки</h2>
            
            <Card className="p-6">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Delivery Method Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Способ доставки</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
                      <input 
                        type="radio" 
                        name="delivery_method" 
                        value="nova_poshta"
                        className="mr-2"
                        disabled={!isEditing}
                      />
                      <span className="font-medium">Нова Пошта</span>
                      <p className="text-sm text-gray-600 mt-1">Доставка до отделения</p>
                    </div>
                    <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
                      <input 
                        type="radio" 
                        name="delivery_method" 
                        value="ukrposhta"
                        className="mr-2"
                        disabled={!isEditing}
                      />
                      <span className="font-medium">Укрпошта</span>
                      <p className="text-sm text-gray-600 mt-1">Почтовая доставка</p>
                    </div>
                  </div>
                </div>

                {/* City */}
                <div>
                  <Label htmlFor="city">Город *</Label>
                  <Input
                    id="city"
                    value={userProfile.city}
                    onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Киев"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Укажите город доставки</p>
                </div>

                {/* Nova Poshta Department */}
                <div>
                  <Label htmlFor="np_department">Номер отделения Новой Почты</Label>
                  <Input
                    id="np_department"
                    value={userProfile.np_department || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, np_department: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Например: №15 или Отделение 15"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Номер вашего отделения Новой Почты</p>
                </div>

                {/* Street Address */}
                <div>
                  <Label htmlFor="address">Полный адрес (улица, дом, квартира)</Label>
                  <Input
                    id="address"
                    value={userProfile.address}
                    onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                    disabled={!isEditing}
                    placeholder="ул. Крещатик, д. 1, кв. 10"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Для курьерской доставки</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Region/Oblast */}
                  <div>
                    <Label htmlFor="region">Область/Регион</Label>
                    <Input
                      id="region"
                      value={userProfile.region || ''}
                      onChange={(e) => setUserProfile({ ...userProfile, region: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Киевская область"
                      className="mt-1"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <Label htmlFor="postal_code">Почтовый индекс</Label>
                    <Input
                      id="postal_code"
                      value={userProfile.postal_code}
                      onChange={(e) => setUserProfile({ ...userProfile, postal_code: e.target.value })}
                      disabled={!isEditing}
                      placeholder="01001"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="delivery_notes">Дополнительные заметки</Label>
                  <textarea
                    id="delivery_notes"
                    value={userProfile.delivery_notes || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, delivery_notes: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Например: код домофона, этаж, особые пожелания по доставке"
                    className="mt-1 w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  {!isEditing ? (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Редактировать адрес
                    </Button>
                  ) : (
                    <>
                      <Button type="submit">Сохранить изменения</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Отменить
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Настройки аккаунта</h2>
            
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Изменить пароль</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Для изменения пароля обратитесь в службу поддержки
                  </p>
                  <Button variant="outline" disabled>
                    Изменить пароль (скоро)
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-2 text-red-600">Удалить аккаунт</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Это действие необратимо. Все ваши данные будут удалены.
                  </p>
                  <Button variant="destructive" disabled>
                    Удалить аккаунт (скоро)
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

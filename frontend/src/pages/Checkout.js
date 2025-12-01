import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { checkoutAPI } from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { CreditCard, Lock } from 'lucide-react';

const Checkout = () => {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'USA',
  });
  const navigate = useNavigate();

  const cartItems = cart?.items || [];
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await checkoutAPI.createSession({
        shipping_address: shippingAddress,
      });

      // Redirect to Stripe
      window.location.href = response.data.checkout_url;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Checkout failed');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div data-testid="checkout-page" className="min-h-screen py-12">
      <div className="container-main max-w-5xl">
        <h1 data-testid="checkout-title" className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form data-testid="checkout-form" onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  data-testid="street-input"
                  id="street"
                  name="street"
                  required
                  value={shippingAddress.street}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    data-testid="city-input"
                    id="city"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    data-testid="state-input"
                    id="state"
                    name="state"
                    required
                    value={shippingAddress.state}
                    onChange={handleChange}
                    placeholder="NY"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    data-testid="postal-code-input"
                    id="postal_code"
                    name="postal_code"
                    required
                    value={shippingAddress.postal_code}
                    onChange={handleChange}
                    placeholder="10001"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    data-testid="country-input"
                    id="country"
                    name="country"
                    required
                    value={shippingAddress.country}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Lock className="w-4 h-4" />
                  <span>Secure payment powered by Stripe</span>
                </div>
                <Button
                  data-testid="place-order-button"
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 sticky top-24">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x Item
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-4 border-t">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold pt-4 border-t">
                <span>Total</span>
                <span data-testid="checkout-total">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
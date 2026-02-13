'use client';

import React, { useState } from 'react';
import {
  Card,
  Alert,
  Space,
  Typography,
  Row,
  Col,
  Tag,
  Divider,
  message as antMessage,
} from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import {
  BANKNOTES,
  COINS,
  INITIAL_MACHINE_MONEY,
  INITIAL_PRODUCTS,
} from '../constant';
import ButtonCustom from '../components/common/ButtomCustom';
import { AlertMessage, MachineMoney } from '@/types';
import { calculateChange, formatChange } from '@/utils/change';
import { number } from '@/utils';

const { Title, Text } = Typography;

export default function VendingMachine() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [machineMoney, setMachineMoney] = useState<MachineMoney>(
    INITIAL_MACHINE_MONEY,
  );
  const [insertedMoney, setInsertedMoney] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<AlertMessage>({
    type: null,
    text: '',
  });
  const [dispensing, setDispensing] = useState(false);

  const addMoney = (amount: number) => {
    setInsertedMoney((prev) => prev + amount);
    setAlertMessage({ type: null, text: '' });
    antMessage.success(
      `Inserted ${number.format(amount, {
        showDecimal: false,
      })} ฿`,
    );
  };

  const purchaseProduct = () => {
    if (!selectedProduct) {
      setAlertMessage({
        type: 'warning',
        text: 'Please select a product first',
      });
      return;
    }

    const product = products.find((p) => p.id === selectedProduct);

    if (!product || product.stock <= 0) {
      setAlertMessage({ type: 'error', text: 'Product out of stock' });
      return;
    }

    if (insertedMoney < product.price) {
      setAlertMessage({
        type: 'warning',
        text: `Insufficient funds. Need ${product.price - insertedMoney} ฿ more`,
      });
      return;
    }

    const changeAmount =
      Math.round((insertedMoney - product.price) * 100) / 100;

    if (changeAmount > 0) {
      const change = calculateChange(
        changeAmount,
        machineMoney,
        COINS,
        BANKNOTES,
      );

      if (!change) {
        setAlertMessage({
          type: 'error',
          text: 'Unable to provide exact change. Please use exact amount or smaller bills.',
        });
        return;
      }

      const newMachineMoney = {
        coins: { ...machineMoney.coins },
        banknotes: { ...machineMoney.banknotes },
      };

      if (change.banknotes) {
        for (const denom in change.banknotes) {
          const key = Number(denom) as keyof typeof newMachineMoney.banknotes;
          newMachineMoney.banknotes[key] -= change.banknotes[key]!;
        }
      }

      if (change.coins) {
        for (const denom in change.coins) {
          const key = Number(denom) as keyof typeof newMachineMoney.coins;
          newMachineMoney.coins[key] -= change.coins[key]!;
        }
      }

      setMachineMoney(newMachineMoney);

      setDispensing(true);
      antMessage.loading('Dispensing product...', 1.5);

      setTimeout(() => {
        const newProducts = products.map((p) =>
          p.id === selectedProduct ? { ...p, stock: p.stock - 1 } : p,
        );
        setProducts(newProducts);
        setInsertedMoney(0);
        setSelectedProduct(null);
        setDispensing(false);

        const changeDescription = formatChange(change);
        setAlertMessage({
          type: 'success',
          text: `Dispensed ${product.name}! Change: ${changeDescription}`,
        });
        antMessage.success('Enjoy your purchase!');
      }, 1500);
    } else {
      setDispensing(true);
      antMessage.loading('Dispensing product...', 1.5);

      setTimeout(() => {
        const newProducts = products.map((p) =>
          p.id === selectedProduct ? { ...p, stock: p.stock - 1 } : p,
        );
        setProducts(newProducts);
        setInsertedMoney(0);
        setSelectedProduct(null);
        setDispensing(false);
        setAlertMessage({
          type: 'success',
          text: `Dispensed ${product.name}! Exact amount - no change.`,
        });
        antMessage.success('Enjoy your purchase!');
      }, 1500);
    }
  };

  const returnMoney = () => {
    if (insertedMoney > 0) {
      antMessage.info(
        `Returned ${number.format(insertedMoney, {
          showDecimal: false,
        })} ฿`,
      );
      setAlertMessage({
        type: 'info',
        text: `Returned ${number.format(insertedMoney, {
          showDecimal: false,
        })} ฿`,
      });
      setInsertedMoney(0);
      setSelectedProduct(null);
    }
  };

  // check coins, banknotes, stock is available or not

  const totalCoins = Object.values(machineMoney.coins).reduce(
    (a, b) => a + b,
    0,
  );
  const totalNotes = Object.values(machineMoney.banknotes).reduce(
    (a, b) => a + b,
    0,
  );
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  console.log(totalCoins, totalNotes, totalStock);

  return (
    <div className="min-h-screen p-5  bg-purple-500">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="text-center mb-5">
          <h1 className="text-white text-2xl sm:text-4xl mb-5">
            <ShopOutlined /> BLUE VENDING
          </h1>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              style={{
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}>
              <Card
                style={{
                  background: '#001529',
                  marginBottom: '24px',
                  borderRadius: '12px',
                }}>
                <Row gutter={16}>
                  <Col xs={24}>
                    <div className="flex flex-col sm:flex-row justify-between items-center text-lg sm:text-2xl text-green-500">
                      <p>Inserted Amount</p>
                      <p>
                        <DollarOutlined /> {number.format(insertedMoney)} ฿
                      </p>
                    </div>
                  </Col>
                  <Col xs={24}>
                    {selectedProduct && (
                      <div className="slide-down flex gap-3 mt-3">
                        <p className="text-amber-500">Selected Product:</p>
                        <p className="text-white">
                          {products.find((p) => p.id === selectedProduct)?.name}
                        </p>
                      </div>
                    )}
                  </Col>
                </Row>

                {alertMessage.text && (
                  <Alert
                    title={alertMessage.text ?? ''}
                    type={alertMessage.type ?? undefined}
                    showIcon
                    style={{ marginTop: '16px', color: '#000' }}
                    closable
                  />
                )}
              </Card>

              <div style={{ marginBottom: '24px' }}>
                <Title level={4}>
                  <ShoppingCartOutlined /> Available Products
                </Title>
                <Row gutter={[16, 16]}>
                  {products.map((product) => (
                    <Col xs={12} sm={8} md={6} key={product.id}>
                      <Card
                        hoverable={product.stock > 0 && !dispensing}
                        className={`product-card ${
                          selectedProduct === product.id ? 'selected' : ''
                        } ${product.stock === 0 || dispensing ? 'disabled' : ''}`}
                        onClick={() => {
                          if (product.stock > 0 && !dispensing) {
                            setSelectedProduct(product.id);
                            setAlertMessage({ type: null, text: '' });
                          }
                        }}
                        style={{
                          background:
                            product.stock > 0
                              ? `linear-gradient(135deg, ${product.color}22, ${product.color}11)`
                              : '#f5f5f5',
                          borderColor:
                            selectedProduct === product.id
                              ? '#1890ff'
                              : '#d9d9d9',
                          borderWidth:
                            selectedProduct === product.id ? '2px' : '1px',
                          height: '100%',
                        }}>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            className="float-animation"
                            style={{
                              fontSize: '48px',
                              marginBottom: '12px',
                              filter:
                                product.stock === 0
                                  ? 'grayscale(100%)'
                                  : 'none',
                            }}>
                            {product.image}
                          </div>
                          <Text
                            strong
                            style={{ display: 'block', marginBottom: '4px' }}>
                            {product.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: '18px',
                              fontWeight: 'bold',
                              color: product.color,
                            }}>
                            {number.format(product.price, {
                              showDecimal: false,
                            })}{' '}
                            ฿
                          </Text>
                          <div style={{ marginTop: '8px' }}>
                            {product.stock > 0 ? (
                              <Tag
                                color={
                                  product.stock > 3 ? 'success' : 'warning'
                                }>
                                Stock:{' '}
                                {number.format(product.stock, {
                                  showDecimal: false,
                                })}
                              </Tag>
                            ) : (
                              <Tag color="error">SOLD OUT</Tag>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={
                <span style={{ fontSize: '18px' }}>
                  <DollarOutlined /> Insert Money
                </span>
              }
              style={{
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                position: 'sticky',
                top: '24px',
              }}>
              <div style={{ marginBottom: '24px' }}>
                <Title level={5}>Coins</Title>
                <Space wrap>
                  {COINS.map((coin) => (
                    <>
                      <ButtonCustom
                        text={`🪙 ${coin} ฿`}
                        size="large"
                        onClick={() => addMoney(coin)}
                        disabled={dispensing}
                        style={{
                          background:
                            'linear-gradient(135deg, #ffd700, #ffed4e)',
                          borderColor: '#d4af37',
                          color: '#654321',
                          fontWeight: 'bold',
                          height: '56px',
                          minWidth: '100px',
                        }}
                      />
                    </>
                  ))}
                </Space>
              </div>

              <Divider />

              <div style={{ marginBottom: '24px' }}>
                <Title level={5}>Banknotes</Title>
                <Space wrap>
                  {BANKNOTES.map((note) => (
                    <>
                      <ButtonCustom
                        size="large"
                        onClick={() => addMoney(note)}
                        disabled={dispensing}
                        text={`💵 ${note.toLocaleString()} ฿`}
                        style={{
                          background:
                            'linear-gradient(135deg, #52c41a, #73d13d)',
                          borderColor: '#389e0d',
                          color: 'white',
                          fontWeight: 'bold',
                          height: '56px',
                          minWidth: '100px',
                        }}
                      />
                    </>
                  ))}
                </Space>
              </div>

              <Divider />

              <div className="w-full flex gap-3 flex-col sm:flex-row">
                <ButtonCustom
                  text={dispensing ? 'Dispensing...' : 'Purchase'}
                  type="primary"
                  size="large"
                  icon={<CheckCircleOutlined />}
                  onClick={purchaseProduct}
                  disabled={
                    !selectedProduct || insertedMoney === 0 || dispensing
                  }
                  loading={dispensing}
                  style={{ flex: 1, padding: 10, fontSize: '16px' }}
                  block
                />

                <ButtonCustom
                  text="Return Money"
                  danger
                  size="large"
                  icon={<RollbackOutlined />}
                  onClick={returnMoney}
                  disabled={insertedMoney === 0 || dispensing}
                  style={{ flex: 1, padding: 10, fontSize: '16px' }}
                  block
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

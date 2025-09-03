import * as yup from 'yup';

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Geçerli bir e-posta giriniz.')
    .required('E-posta zorunludur.'),
  password: yup
    .string()
    .min(6, 'Şifre en az 6 karakter olmalı.')
    .required('Şifre zorunludur.'),
});

export const registerValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'İsim minimum 2 harf olmalıdır.')
    .required('İsim alanı boş bırakılamaz.'),

  surname: yup
    .string()
    .min(2, 'Soyisim minimum 2 harf olmalıdır.')
    .required('Soyisim alanı boş bırakılamaz.'),

  email: yup
    .string()
    .email('Lütfen geçerli bir e-posta adresi girin.')
    .required('E-posta alanı boş bırakılamaz.'),

  password: yup
    .string()
    .min(6, 'Şifre en az 6 karakter olmalı.')
    .max(12, 'Şifre en fazla 12 karakter olmalı.')
    .required('Şifre zorunludur.'),
});

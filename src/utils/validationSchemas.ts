import * as yup from 'yup';
import { isValidPhoneFormat } from './basicValidations';

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
    .max(16, 'İsim maksimum 16 harf olmalıdır.')
    .required('İsim alanı boş bırakılamaz.'),
  surname: yup
    .string()
    .min(2, 'Soyisim minimum 2 harf olmalıdır.')
    .max(16, 'Soyisim maksimum 16 harf olmalıdır.')
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

export const accountDetailsValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'İsim minimum 2 harf olmalıdır.')
    .max(16, 'İsim maksimum 16 harf olmalıdır.')
    .required('İsim zorunludur'),
  surname: yup
    .string()
    .min(2, 'Soyisim minimum 2 harf olmalıdır.')
    .max(16, 'Soyisim maksimum 16 harf olmalıdır.')
    .required('Soyisim zorunludur'),
  phone: yup
    .string()
    .test('is-valid-phone', 'Geçerli bir telefon numarası girin', value => {
      if (!value) return true;
      return isValidPhoneFormat(value);
    }),
  bio: yup.string().max(120, 'Maksimum 120 karakter olabilir'),
});

export const adoptionValidationSchema = yup.object().shape({
  photos: yup
    .array()
    .min(1, 'En az bir fotoğraf eklemelisiniz.')
    .required('Fotoğraf zorunludur.'),

  title: yup
    .string()
    .min(8, 'Başlık en az 8 karakter olmalı.')
    .required('Başlık zorunludur.'),

  description: yup
    .string()
    .min(16, 'Açıklama en az 16 karakter olmalı.')
    .required('Açıklama zorunludur.'),

  phone: yup
    .string()
    .required('Telefon numarası zorunludur.')
    .test(
      'is-valid-phone',
      'Geçerli bir telefon numarası giriniz.',
      value => !!value && isValidPhoneFormat(value),
    ),

  animalType: yup.string().required('Tür seçilmelidir.'),
  animalBreed: yup.string().required('Cins seçilmelidir.'),

  age: yup
    .number()
    .typeError('Yaş sadece sayı olmalıdır.')
    .moreThan(0, 'Yaş 0’dan büyük olmalıdır.')
    .max(20, "Yaş 20'den büyük olamaz.")
    .test(
      'is-half-or-int',
      'Yaş sadece tam sayı veya yarım değerlikler olabilir.',
      value => {
        if (value == null) return true;
        const decimal = value % 1;
        return decimal === 0 || decimal === 0.5;
      },
    )
    .nullable(),

  address: yup
    .object()
    .shape({
      latitude: yup.number().required('Konum bilgisi eksik'),
      longitude: yup.number().required('Konum bilgisi eksik'),
      formattedAddress: yup
        .string()
        .required('Adres zorunludur.')
        .min(10, 'Adres en az 10 karakter olmalıdır.'),
    })
    .required('Adres seçilmelidir.'),

  vaccinated: yup.boolean().nullable(),
  sterilized: yup.boolean().nullable(),
});

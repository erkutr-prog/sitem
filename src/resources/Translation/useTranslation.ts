import i18n from "./I18n";

export const useTranslation = () => {
  return {
    t: (val: string) => i18n.t(val),
  };
};

export default useTranslation;

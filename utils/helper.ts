export const getHtmlTemplateName = (pdfType: string): string => {
    switch (pdfType.toLowerCase()) {
        case 'receipt-payment':
            return 'receipt-payment';
        default:
            return pdfType.toLowerCase();
    }
  };
  
export const getRenderData = (data: any, pdfType: string) => {
    switch (pdfType.toLowerCase()) {
        case 'receipt-payment':
            return getReceiptPaymentRenderData(data);
        default:
            return data;
    }
  };
  
export const getReceiptPaymentRenderData = (data: {
    type: string;
    paymentId: string;
    amount: number;
    method: string;
    merchantName: string;
    merchantType: string;
    createAt: string;
}) => {
    return { ...data};
}


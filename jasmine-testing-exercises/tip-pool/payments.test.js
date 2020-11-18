describe("Payments test", function() {
  beforeEach(function() {
    billAmtInput.value = 100;
    tipAmtInput.value = 20;
  });

  it('should add payment info to allPayments, update display, and reset inputs', function () {
    const allPaymentsLength = Object.keys(allPayments).length;

    submitPaymentInfo();

    expect(Object.keys(allPayments).length).toEqual(allPaymentsLength+1);

    expect(allPayments['payment' + paymentId].billAmt).toEqual('100');
    expect(allPayments['payment' + paymentId].tipAmt).toEqual('20');

    expect(billAmtInput.value).toEqual('');
    expect(tipAmtInput.value).toEqual('');
  });

  it('should create a curPayment object if inputs are available', function () {
    let curPayment = createCurPayment();

    expect(curPayment.billAmt).toEqual('100');
    expect(curPayment.tipAmt).toEqual('20');
    expect(curPayment.tipPercent).toEqual(20);

    submitPaymentInfo();

    // Empty inputs
    curPayment = createCurPayment();

    expect(curPayment).toEqual(undefined);
  });

  it('should create a table row with a given curPayment object', function () {
    ++paymentId;
    appendPaymentTable(createCurPayment());
    const newTr = document.querySelector('#payment' + paymentId);

    expect(newTr.children[0].innerText).toEqual('$100');
    expect(newTr.children[1].innerText).toEqual('$20');
    expect(newTr.children[2].innerText).toEqual('20%');

    newTr.remove();
    --paymentId;

    submitPaymentInfo();
  });

  it('should update the summary information', function () {
    const oldSummary = [sumPaymentTotal('billAmt'), sumPaymentTotal('tipAmt')];

    submitPaymentInfo();

    expect(summaryTds[0].innerHTML).toEqual('$' + (oldSummary[0] + 100));
    expect(summaryTds[1].innerHTML).toEqual('$' + (oldSummary[1] + 20));
  });

  afterEach(function () {
    delete allPayments['payment' + paymentId];
    document.querySelector('#payment' + paymentId).remove();
    --paymentId;
    updateSummary();
  });
});
import {
    Typography,
    Layout,
    Row,
    Col,
    Button,
    Space,
    InputNumber,
    DatePicker,
    message,
    Popover,
} from 'antd'

import {
    useContext,
    useState,
    useMemo,
    useEffect,
} from 'react'

import { Context } from './store/Context'

import dayjs from 'dayjs'

import { Column } from '@ant-design/plots'

import {
    setCookies,
} from './store/utils'


function InputRow(props) {
    const name = props.name
    const value = props.value
    const setValue = props.setValue
    const suffix = props.suffix
    const step = props.step
    const description = props.description
    return (
        <Space.Compact>
            <Popover trigger='click' placement='top' title={name} content={<Row style={{'width': '300px'}}>{description}</Row>}>
                <Button style={{'width': '125px', 'cursor': 'pointer', 'backgroundColor': 'AliceBlue'}}>
                    <Row style={{'width': '100%'}} justify='start'>
                        {name}
                    </Row>
                </Button>
            </Popover>
            <InputNumber 
                step={step}
                min={0}
                style={{'width': '125px'}}
                value={value} 
                onChange={(val) => {
                    setValue(val)
            }}/>
            <Button style={{'width': '50px', 'cursor': 'default'}}>{suffix}</Button>
        </Space.Compact>  
    )
}

function InputRowCalendar(props) {
    const name = props.name
    const value = props.value
    const setValue = props.setValue
    const description = props.description
    return (
        <Space.Compact>
            <Popover trigger='click' title={name} content={<Row style={{'width': '300px'}}>{description}</Row>}>
                <Button style={{'width': '125px', 'cursor': 'pointer', 'backgroundColor': 'AliceBlue'}}>
                    <Row style={{'width': '100%'}} justify='start'>
                        {name}
                    </Row>
                </Button>
            </Popover>
            <DatePicker 
                style={{'width': '175px'}}
                allowClear={false} 
                picker='month' 
                value={value} 
                onChange={(date, dateString) => {
                    setValue(date)
            }} />
        </Space.Compact>
    )
}


function DisplayRow(props) {
    const name = props.name
    const value = props.value
    const [messageApi, contextHolder] = message.useMessage()

    return (
        <Space.Compact>
            <Button style={{'width': '220px', 'cursor': 'default'}} onClick={() => {
                navigator.clipboard.writeText(name)
                messageApi.success(`Copied successfully: ${name}`)
            }}>
                <Row style={{'width': '100%'}} justify='start'>
                    {name}
                </Row>
            </Button>
            {contextHolder}
            <Button justify='center' align='middle' style={{'width': '79px', 'cursor': 'default'}} onClick={() => {
                navigator.clipboard.writeText(value)
                messageApi.success(`Copied successfully: ${value}`)
            }}>
                <Row style={{'width': '100%'}} justify='end'>
                    {value}
                </Row>
            </Button>
        </Space.Compact> 
    )
}

function DesktopCalculator() {
    const {state, dispatch} = useContext(Context)

    const [homeValue, setHomeValue] = useState(state.homeValue)
    const [downPayment, setDownPayment] = useState(state.downPayment)
    const [loanAmount, setLoanAmount] = useState(state.loanAmount)
    

    const [loanTermInYears, setLoanTermInYears] = useState(state.loanTermInYears) // years

    const loanTermInMonths = useMemo(() => {
        return loanTermInYears * 12
    }, [loanTermInYears])


    const [interestRateRawNumber, setInterestRateRawNumber] = useState(state.interestRateRawNumber) // percent

    const interestRate = useMemo(() => {
        return interestRateRawNumber / 100
    }, [interestRateRawNumber])

    const monthlyInterestRate = useMemo(() => {
        return interestRate / 12
    }, [interestRate])


    const [startMonth, setStartMonth] = useState(state.startMonth)
    const [propertyTax, setPropertyTax] = useState(state.propertyTax) // per year  
    const [homeInsurance, setHomeInsurance] = useState(state.homeInsurance) // per year
    const [monthlyHOAPayment, setMonthlyHOAPayment] = useState(state.monthlyHOAPayment)


    const [PMIRateRawNumber, setPMIRateRawNumber] = useState(state.PMIRateRawNumber) // percent

    useEffect(() => {
        setCookies({
            'homeValue': homeValue,
        })
    }, [homeValue])

    useEffect(() => {
        setCookies({
            'downPayment': downPayment,
        })
    }, [downPayment])

    useEffect(() => {
        setCookies({
            'loanAmount': loanAmount,
        })
    }, [loanAmount])

    useEffect(() => {
        setCookies({
            'loanTermInYears': loanTermInYears,
        })
    }, [loanTermInYears])

    useEffect(() => {
        setCookies({
            'interestRateRawNumber': interestRateRawNumber,
        })
    }, [interestRateRawNumber])

    useEffect(() => {
        setCookies({
            'startMonth': startMonth.format('YYYY-MM'),
        })
    }, [startMonth])

    useEffect(() => {
        setCookies({
            'propertyTax': propertyTax,
        })
    }, [propertyTax])

    useEffect(() => {
        setCookies({
            'homeInsurance': homeInsurance,
        })
    }, [homeInsurance])

    useEffect(() => {
        setCookies({
            'monthlyHOAPayment': monthlyHOAPayment,
        })
    }, [monthlyHOAPayment])

    useEffect(() => {
        setCookies({
            'PMIRateRawNumber': PMIRateRawNumber,
        })
    }, [PMIRateRawNumber])



    const PMIRate = useMemo(() => {
        return PMIRateRawNumber / 100
    }, [PMIRateRawNumber])

    const monthlyPMIRate = useMemo(() => {
        return PMIRate / 12
    }, [PMIRate])

    const monthlyPMIPayment = useMemo(() => {
        return Math.round(monthlyPMIRate * loanAmount)
    }, [monthlyPMIRate, loanAmount])


    const monthlyMortgagePayment = useMemo(() => {
        if (monthlyInterestRate == 0) {
            return loanAmount / loanTermInMonths
        }
        return Math.round(monthlyInterestRate * loanAmount / (1 - (1 + monthlyInterestRate) ** -loanTermInMonths))

    }, [monthlyInterestRate, loanTermInMonths, loanAmount])

    const annualMortgageBudget = useMemo(() => {
        return Math.round(monthlyMortgagePayment * 12)
    }, [monthlyMortgagePayment])

    const annualHOABudget = useMemo(() => {
        return Math.round(monthlyHOAPayment * 12)
    }, [monthlyHOAPayment])

    const annualPMIBudget = useMemo(() => {
        return Math.round(loanAmount * PMIRate)
    }, [monthlyPMIPayment])


    const loanPayoffMonth = useMemo(() => {
        return startMonth.add(loanTermInMonths - 1, 'month')
    }, [startMonth, loanTermInYears])

    const totalMortgagePaid = useMemo(() => {
        return Math.round(monthlyMortgagePayment * loanTermInMonths)
    }, [monthlyMortgagePayment, loanTermInMonths])

    const totalInterestPaid = useMemo(() => {
        return Math.round(totalMortgagePaid - loanAmount)
    }, [totalMortgagePaid, loanAmount])

    const totalPropertyTaxPaid = useMemo(() => {
        return Math.round(propertyTax * loanTermInYears)
    }, [propertyTax, loanTermInYears])

    const totalHomeInsurancePaid = useMemo(() => {
        return Math.round(homeInsurance * loanTermInYears)
    }, [homeInsurance, loanTermInYears])

    const totalHOAPaid = useMemo(() => {
        return Math.round(monthlyHOAPayment * loanTermInMonths)
    }, [monthlyHOAPayment, loanTermInMonths])

    const totalPMIPaid = useMemo(() => {
        return Math.round(monthlyPMIPayment * loanTermInMonths)
    }, [monthlyPMIPayment, loanTermInMonths])


    const monthlyPropertyTaxPayment = useMemo(() => {
        return Math.round(propertyTax / 12)
    }, [propertyTax])

    const monthlyHomeInsurancePayment = useMemo(() => {
        return Math.round(homeInsurance / 12)
    }, [homeInsurance])

    
    const dataVisualizationConfig = useMemo(() => {
        // mortgage total, property tax payment, home insurance payment, HOA payment, PMI payment
        let currentMonth = startMonth
        
        let tmpLoanPrincipal = loanAmount
        let tmpLoanPrincipalPayment = 0
        let tmpLoanInterestPayment = 0
        let tmpTax = 0
        let tmpInsurance = 0
        let tmpHOA = 0
        let tmpPMI = 0


        const dataVec = []
        
        let loopCount = 0
        // year, principal payment, interest payment, property tax, home insurance, HOA, PMI
        for (let i = 0; i < loanTermInMonths; i++) {
            loopCount += 1
            const currentMonthLoanInterestPayment = tmpLoanPrincipal * monthlyInterestRate
            tmpLoanInterestPayment += currentMonthLoanInterestPayment

            const currentMonthLoanPrincipalPayment = monthlyMortgagePayment - currentMonthLoanInterestPayment
            tmpLoanPrincipalPayment += currentMonthLoanPrincipalPayment
            tmpLoanPrincipal -= currentMonthLoanPrincipalPayment


            tmpTax += monthlyPropertyTaxPayment
            tmpInsurance += monthlyHomeInsurancePayment
            tmpHOA += monthlyHOAPayment
            tmpPMI += monthlyPMIPayment

            
            if (currentMonth.format('MM') === '12' || i === loanTermInMonths - 1) {
                dataVec.push({
                    'year': currentMonth.format('YYYY'),
                    'name': 'Principal',
                    'value': Math.round(tmpLoanPrincipalPayment),
                })
                dataVec.push({
                    'year': currentMonth.format('YYYY'),
                    'name': 'Interest',
                    'value': Math.round(tmpLoanInterestPayment),
                })
                if (loopCount === 12) {
                    dataVec.push({
                        'year': currentMonth.format('YYYY'),
                        'name': 'Tax',
                        'value': propertyTax,
                    })
                    dataVec.push({
                        'year': currentMonth.format('YYYY'),
                        'name': 'Insurance',
                        'value': homeInsurance,
                    })
                    dataVec.push({
                        'year': currentMonth.format('YYYY'),
                        'name': 'HOA',
                        'value': monthlyHOAPayment * 12,
                    })
                    dataVec.push({
                        'year': currentMonth.format('YYYY'),
                        'name': 'PMI',
                        'value': annualPMIBudget,
                    })
                } else {
                    dataVec.push({
                        'year': currentMonth.format('YYYY'),
                        'name': 'Tax',
                        'value': Math.round(tmpTax),
                    })
                    dataVec.push({
                        'year': currentMonth.format('YYYY'),
                        'name': 'Insurance',
                        'value': Math.round(tmpInsurance),
                    })
                    dataVec.push({
                        'year': currentMonth.format('YYYY'),
                        'name': 'HOA',
                        'value': Math.round(tmpHOA),
                    })
                    dataVec.push({
                        'year': currentMonth.format('YYYY'),
                        'name': 'PMI',
                        'value': Math.round(tmpPMI),
                    })
                }


                tmpLoanPrincipalPayment = 0
                tmpLoanInterestPayment = 0
                tmpTax = 0
                tmpInsurance = 0
                tmpHOA = 0
                tmpPMI = 0

                loopCount = 0
            }

            currentMonth = currentMonth.add(1, 'month')
        }

        const config = {
            data: dataVec,
            xField: 'year',
            yField: 'value',
            colorField: 'name',
            stack: true,
            axis: {
                y: { labelFormatter: '~s' },
                x: {
                    labelSpacing: 4,
                    style: {
                        labelTransform: 'rotate(90)',
                    },
                },
            },
        }
        return config
    }, [loanAmount, loanTermInYears, interestRate, startMonth, propertyTax, homeInsurance, monthlyHOAPayment, PMIRate])



    return (
        <Layout style={{'minWidth': '1000px'}}>
            <Layout.Content>
                <Row justify='center' style={{'paddingTop': '10px', 'backgroundColor': 'white'}}>
                    <Row justify='center' style={{'width': '100%'}}>
                        <Typography.Title level={4}>
                            Mortgage Calculator
                        </Typography.Title>
                    </Row>

                    <Row justify='center' style={{'width': '100%', 'marginTop': '16px'}}>
                        <Col>
                            <Row justify='center' style={{'width': '300px'}}>
                                <InputRow name='Home value' value={homeValue} setValue={(val) => {
                                    setHomeValue(val)
                                    setLoanAmount(val - downPayment)
                                }} suffix='$' step={10000} description='Home value in residential real estate is the estimated monetary worth of a property, influenced by factors like location, size, condition, market trends, and comparable sales.' />
                            
                                <InputRow name='Down payment' value={downPayment} setValue={(val) => {
                                    setDownPayment(val)
                                    setLoanAmount(homeValue - val)
                                }} suffix='$' step={10000} description='A down payment is the initial, upfront payment made by a buyer when purchasing a home, typically expressed as a percentage of the total property price, with the remaining balance financed through a mortgage.' />

                                <InputRow name='Loan amount' value={loanAmount} setValue={(val) => {
                                    setLoanAmount(val)
                                    setDownPayment(homeValue - val)
                                }} suffix='$' step={10000} description='The loan amount is the total sum of money that a borrower receives from a lender to finance the purchase of a home, which is typically the difference between the purchase price and the down payment.' />
                                
                                <InputRow name='Loan term' value={loanTermInYears} setValue={setLoanTermInYears} suffix='years' step={1} description='The loan term is the length of time over which a borrower agrees to repay a mortgage, typically ranging from 15 to 30 years.' />

                                <InputRow name='Interest rate' value={interestRateRawNumber} setValue={setInterestRateRawNumber} suffix='%/year' step={0.1} description='The interest rate is the percentage charged by a lender on the loan amount, representing the cost of borrowing money, and is applied to the outstanding balance over the loan term.' />

                                <InputRowCalendar name='Start month' value={startMonth} setValue={(date) => {setStartMonth(dayjs(date))}} description='The start month is the first month in which a borrower begins making scheduled payments on a loan, marking the commencement of the repayment period.' />

                                <InputRow name='Property tax' value={propertyTax} setValue={setPropertyTax} suffix='$/year' step={1000} description='Property tax is a recurring tax levied by local governments on the assessed value of a property, typically used to fund public services like schools, infrastructure, and emergency services.' />
                                <InputRow name='Home insurance' value={homeInsurance} setValue={setHomeInsurance} suffix='$/year' step={100} description='Home insurance is a policy that provides financial protection for homeowners against potential damages to their property and belongings, as well as liability for accidents that occur on the property.' />

                                <InputRow name='Monthly HOA' value={monthlyHOAPayment} setValue={setMonthlyHOAPayment} suffix='$' step={10} description='Monthly HOA (Homeowners Association) fees are regular payments made by property owners to cover the costs of maintaining and managing shared community amenities and services, such as landscaping, security, and communal facilities.' />

                                <InputRow name='PMI' value={PMIRateRawNumber} setValue={setPMIRateRawNumber} suffix='%/year' step={0.1} description="Private Mortgage Insurance (PMI) is a type of insurance that protects lenders against loss if a borrower defaults on a mortgage, typically required when the down payment is less than 20% of the home's purchase price." />
                            </Row>

                        </Col>

                        <Col offset={1}>
                            <Row justify='center' style={{'width': '300px'}}>                            
                                <DisplayRow name='Monthly mortgage payment' value={monthlyMortgagePayment} />
                                <DisplayRow name='Monthly HOA payment' value={monthlyHOAPayment} />
                                <DisplayRow name='Monthly PMI payment' value={monthlyPMIPayment} />
                            </Row>


                            <Row justify='center' style={{'width': '300px', 'marginTop': '32px'}}>
                                <DisplayRow name='Annual mortgage budget' value={annualMortgageBudget} />
                                <DisplayRow name='Annual property tax budget' value={propertyTax} />
                                <DisplayRow name='Annual home insurance budget' value={homeInsurance} />
                                <DisplayRow name='Annual HOA budget' value={annualHOABudget} />
                                <DisplayRow name='Annual PMI budget' value={annualPMIBudget} />
                            </Row>

                        </Col>

                        <Col offset={1}>
                            <Row justify='center' style={{'width': '300px'}}>
                                <DisplayRow name='Loan payoff month' value={loanPayoffMonth.format('YYYY-MM')} />

                                <DisplayRow name='Total mortgage paid' value={totalMortgagePaid} />
                                <DisplayRow name='&nbsp;&nbsp;&nbsp;&nbsp;↳Total loan included' value={loanAmount} />
                                <DisplayRow name='&nbsp;&nbsp;&nbsp;&nbsp;↳Total interest included' value={totalInterestPaid} />
                                <DisplayRow name='Total property tax paid' value={totalPropertyTaxPaid} />
                                <DisplayRow name='Total home insurance paid' value={totalHomeInsurancePaid} />
                                <DisplayRow name='Total HOA paid' value={totalHOAPaid} />
                                <DisplayRow name='Total PMI paid' value={totalPMIPaid} />
                            </Row>
                        </Col>
                    </Row>


                    <Row justify='center' style={{'width': '1000px', 'marginTop': '32px'}}>
                        <Column {...dataVisualizationConfig} />
                    </Row>
                </Row>

            </Layout.Content>
        </Layout>
    )
}

export default DesktopCalculator

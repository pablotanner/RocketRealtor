import {useEffect, useState} from "react";
import {
    ArrowLeft,
    ArrowRight, BadgeCheck,
    BuildingIcon,
    Check,
    CrossIcon, DoorClosed,
    Home,
    Image,
    Info,
    ListIcon,
    MapPin, Plus,
    SquareIcon,
    SquareStack, XIcon
} from "lucide-react";
import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {propertySchema, tenantSchema} from "../../utils/formSchemas.js";
import {Form, FormControl, FormField, FormGroup, FormItem, FormLabel, FormMessage} from "../../components/ui/form.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "../../components/ui/card.tsx";
import {Input} from "../../components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/ui/select.tsx";
import {getRealEstateIcon, LeaseStatus, ListingStatus, PaymentFrequency} from "../../utils/magicNumbers.js";
import {RealEstateType} from "../../utils/magicNumbers.js";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "../../components/ui/carousel.tsx";
import {Button} from "../../components/ui/button.tsx";
import {useCreatePropertyMutation} from "../../services/api/propertyApi.js";
import {useNavigate} from "react-router-dom";
import {addDays} from "date-fns";


const TenantCreation = () => {

    const navigate = useNavigate();



    const [tab, setTab] = useState(1)

    const [leaseOption, setLeaseOption] = useState("new")



    const leaseOptions = [
        {
            title: "New Lease",
            description: "Select this option if you want to create a new lease for the tenant",
            icon: <Plus className="w-6 h-6" />,
            value: "new"
        },
        {
            title: "Existing Lease",
            description: "Select this option if you want to assign an existing lease to the tenant",
            icon: <SquareStack className="w-6 h-6" />,
            value: "existing"
        }]



    const tenantForm = useForm(({
        resolver: zodResolver(tenantSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            civilStatus: "",
            occupation: "",
            income: "",
            creditScore: "",
            leases: [
                {
                    startDate: "",
                    endDate: "",
                    rentalPrice: "",
                    paymentFrequency: "MONTHLY",
                    status: "ACTIVE",
                    notes: ""
                }
            ],
            leaseId: "",
            unitId: ""
        },
    }))

    const [tabStates, setTabStates] = useState([
        {
            title: "Tenant Information",
            status: "incomplete"
        },
        {
            title: "Lease Assignment",
            status: "incomplete"
        },
        {
            title: "Unit Assignment",
            status: "incomplete"
        },
        {
            title: "Confirmation",
            status: "incomplete"
        }
    ])


    function setTabStatus(index, status){
        const newTabStates = [...tabStates]
        newTabStates[index - 1].status = status
        setTabStates(newTabStates)
    }

    // Watch for changes in the form


    const formValues = useWatch({
            control: tenantForm.control,
            name: ["firstName", "lastName", "email", "phone", "occupation", "income", "leases[0].startDate", "leases[0].endDate", "leases[0].rentalPrice", "leases[0].paymentFrequency", "leases[0].status"]
        }
    )



    useEffect(() => {
        if (tenantForm.formState.isValid && tenantForm.getValues("unitId") !== ""){
            setTabStatus(3, "complete")
        }
        else{
            setTabStatus(3, "incomplete")
            setTabStatus(4, "incomplete")
        }


        if (tenantForm.formState.isValid) {
            setTabStatus(2, "complete")
        }
        else {
            setTabStatus(2, "incomplete")
            setTabStatus(3, "incomplete")
            setTabStatus(4, "incomplete")
        }

        // If first tab is valid, set it to complete
        if (tenantForm.formState.isValid || (!(tenantForm.getValues("firstName") === "") && !(tenantForm.getValues("lastName") === ""))) {
            setTabStatus(1, "complete")
        }
        else {
            // otherwise disable all
            setTabStatus(1, "incomplete")
            setTabStatus(2, "incomplete")
            setTabStatus(3, "incomplete")
            setTabStatus(4, "incomplete")
        }

    }, [formValues, tenantForm.formState.isValid, tenantForm.getValues("unitId")])


    const onSubmit = (data) => {
        console.log(data)
    }



    const StepTab = ({title, status, index}) => {
        const isDisabled = index !== 1 && tabStates[index - 2].status !== "complete"

        return (
            <div
                data-disabled={isDisabled}
                data-selected={tab === index}
                className="p-4 border-b-2 border-secondary select-none flex flex-col lg:flex-row gap-4 items-center justify-center lg:justify-start w-full hover:border-off-black cursor-pointer data-[selected='true']:border-off-black data-[disabled='true']:opacity-50 data-[disabled='true']:cursor-not-allowed data-[disabled='true']:hover:border-secondary"
                onClick={() => {
                    if (isDisabled) return
                    setTab(index);
                    tenantForm.clearErrors();
                }}
            >
                <div
                    data-complete={status==="complete"}
                    data-selected={tab === index}
                    className="p-2 md:p-4 flex w-8 h-8 md:w-14 md:h-14 items-center justify-center text-md md:text-xl border border-secondary text-gray-400 rounded-lg data-[complete='true']:bg-secondary data-[selected='true']:bg-black data-[selected='true']:text-white">
                    {status === "complete" ? <Check /> : index}
                </div>

                <div className="text-off-black font-500 text-xs md:text-sm text-center">
                    {title}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 relative mb-16">
            <h1>
                Create Tenant
            </h1>

            <div className="flex flex-row justify-between overflow-auto mb-4">
                {tabStates.map((tab, index) => {
                    return (
                        <StepTab title={tab.title} status={tab.status} index={index + 1} key={index}/>
                    )
                })}
            </div>

            <div
                data-selected={tab === 1}
                className=" data-[selected='false']:hidden">
                <Form {...tenantForm}>
                    <form  onSubmit={tenantForm.handleSubmit(onSubmit)} className="flex flex-col flex-wrap gap-4">

                        <Card>
                            <CardHeader className="border-b-2 text-lg font-500 border-secondary p-4 flex flex-row items-center gap-2">
                                <Info/>
                                Tenant Information
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">

                                <FormGroup useFlex>
                                    <FormField
                                        control={tenantForm.control}
                                        name="firstName"
                                        render={({field}) => (
                                            <FormItem  >
                                                <FormLabel>First Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={tenantForm.control}
                                        name="lastName"
                                        render={({field}) => (
                                            <FormItem  >
                                                <FormLabel>Last Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Doe" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </FormGroup>

                                <div className="w-full h-[1px] mt-1 bg-secondary"/>


                                <FormGroup useFlex>
                                    <FormField
                                        control={tenantForm.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem  >
                                                <FormLabel>E-Mail</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john@doe.com" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={tenantForm.control}
                                        name="phone"
                                        render={({field}) => (
                                            <FormItem  >
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </FormGroup>

                                <div className="w-full h-[1px] mt-1 bg-secondary"/>

                                <FormGroup useFlex>
                                    <FormField
                                        control={tenantForm.control}
                                        name="occupation"
                                        render={({field}) => (
                                            <FormItem  >
                                                <FormLabel>Occupation</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nurse" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={tenantForm.control}
                                        name="income"
                                        render={({field}) => (
                                            <FormItem  >
                                                <FormLabel>Income</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" type="number" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </FormGroup>

                            </CardContent>
                        </Card>

                    </form>
                </Form>

            </div>


            <div
                data-selected={tab === 2}
                className=" data-[selected='false']:hidden">


                <Form {...tenantForm}>
                    <form
                          className="flex flex-col flex-wrap gap-4 overflow-auto">

                        <Card>
                            <CardHeader className="border-b-2 text-lg font-500 border-secondary p-4 flex flex-row items-center gap-2">
                                <ListIcon/>
                                Unit Type
                            </CardHeader>
                            <CardContent className="p-6 flex flex-col sm:flex-row gap-4">

                                {leaseOptions.map((option, index) => {
                                    return (
                                        <div
                                            key={index}
                                            data-active={option.value === leaseOption}
                                            className="rounded-lg flex-shrink relative border-secondary border-2 shadow-md p-4 flex bg-secondary/20 items-center justify-center cursor-pointer data-[active=true]:bg-gradient-to-br from-indigo-50 to-white data-[active=true]:text-indigo-600 data-[active=true]:border-primary-dark"
                                            onClick={() => setLeaseOption(option.value)}
                                        >
                                            <div className="text-xl font-600 flex flex-col gap-3">
                                                <div className="p-2 bg-white border border-secondary rounded-lg w-fit shadow-sm">
                                                    {option.icon}
                                                </div>

                                                {option.title}
                                                <p
                                                    data-active={option.value === leaseOption}
                                                    className="text-xs md:text-sm lg:text-md font-400 data-[active='true']:text-indigo-500"
                                                >
                                                    {option.description}
                                                </p>

                                                <div className="absolute -top-3 border-2 border-white -right-3 p-1 bg-indigo-500 rounded-full"
                                                     hidden={leaseOption !== option.value}>
                                                    <Check className="text-white w-4 h-4"/>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}


                            </CardContent>
                        </Card>


                        <Card className="" hidden={leaseOption !== "new"}>
                            <CardHeader className="border-b-2 text-lg font-500 border-secondary p-4 flex flex-row items-center gap-2">
                                <Info/>
                                Create New Lease
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">

                                <p className="mt-4">
                                    If you want to automatically generate planned payments for the lease, please select the payment frequency, rental price, and set the lease status to active.
                                </p>

                                <FormGroup useFlex>

                                    <FormField
                                        control={tenantForm.control}
                                        name="leases[0].startDate"
                                        render={({field}) => (
                                            <FormItem  >
                                                <FormLabel>Start Date *</FormLabel>
                                                <FormControl onChange={() => tenantForm.trigger("leases[0].startDate")}>
                                                    <Input type="date"  {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={tenantForm.control}
                                        name="leases[0].endDate"
                                        render={({field}) => (
                                            <FormItem  >
                                                <FormLabel>End Date *</FormLabel>
                                                <FormControl onChange={() => tenantForm.trigger("leases[0].endDate")}>
                                                    <Input  type="date" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                </FormGroup>

                                <FormGroup useFlex>

                                    <FormField
                                        control={tenantForm.control}
                                        name="leases[0].rentalPrice"
                                        render={({field}) => (
                                            <FormItem  >
                                                <FormLabel>Rental Price</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="2000"  type="number" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={tenantForm.control}
                                        name="leases[0].paymentFrequency"
                                        render={({field}) => (
                                            <FormItem  >
                                                <FormLabel>Payment Frequency *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            Object.keys(PaymentFrequency).map((frequency, index) => {
                                                                return (
                                                                    <SelectItem key={index} value={frequency}>{PaymentFrequency[frequency]}</SelectItem>
                                                                )
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={tenantForm.control}
                                        name="leases[0].status"
                                        render={({field}) => (
                                            <FormItem  >
                                                <FormLabel>Lease Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                           {
                                                               Object.keys(LeaseStatus).map((status, index) => {
                                                                   return (
                                                                       <SelectItem key={index} value={status}>{LeaseStatus[status]}</SelectItem>
                                                                   )
                                                               })
                                                           }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                </FormGroup>

                                <FormGroup useFlex>



                                </FormGroup>

                            </CardContent>
                        </Card>

                        <Card className="" hidden={leaseOption !== "existing"}>
                            <CardHeader className="border-b-2 text-lg font-500 border-secondary p-4 flex flex-row items-center gap-2">
                                <Info/>
                                Add to Existing Lease
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                Existingg
                            </CardContent>
                        </Card>


                    </form>
                </Form>
            </div>

            <div
                data-selected={tab === 3}
                className=" data-[selected='false']:hidden">


                <Form {...tenantForm}>
                    <form className="flex flex-col flex-wrap gap-4 overflow-auto">

                        Testt tab 3

                    </form>
                </Form>
            </div>



            <div
                data-selected={tab === 4}
                className=" data-[selected='false']:hidden">

                <Card>
                    <CardHeader className="border-b-2 text-lg font-500 border-secondary p-4 flex flex-row items-center gap-2">
                        <BadgeCheck/>
                        Confirmation
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col gap-4">
                        Create Tenant revieww



                    </CardContent>
                </Card>


            </div>


            <div className="fixed bottom-0 left-0 z-50 w-full flex flex-row bg-white px-6 h-16 items-center border-y-2 border-secondary justify-between">
                <Button
                    variant="outline"
                    disabled={tab === 1}
                    onClick={() => {
                        if (tab > 1){
                            setTab(tab - 1)
                        }
                    }}
                    type="button"

                >
                    <ArrowLeft className="w-4 h-4 mr-1"/>
                    Back
                </Button>
                <Button
                    type={tab === 4 ? "submit" : "button"}
                    variant="dark"
                    //isLoading={isCreating}
                    onClick={() => {
                    tenantForm.trigger()

                    if (tab === 4 && tabStates[tab - 2].status === "complete"){
                        tenantForm.handleSubmit(onSubmit)()
                    }
                    else if (tab === 4 && tabStates[tab - 2].status !== "complete"){

                    }
                    else if (tabStates[tab - 1].status === "complete"){
                        setTab(tab + 1)
                        tenantForm.clearErrors();
                    }



                }}
                >
                    {tab === 4 ? "Create" : "Next"}
                    {tab === 4 ? <Plus className="w-4 h-4 ml-1"/> : <ArrowRight className="w-4 h-4 ml-1"/>}
                </Button>

            </div>

        </div>
    )
}

export default TenantCreation
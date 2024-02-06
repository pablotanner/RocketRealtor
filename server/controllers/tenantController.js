import prisma from '../prisma.js';


// Creates a tenant, if provided link them to a lease, otherwise create new lease using lease data in body
export async function createTenant(req, res) {
    const {leaseId} = req.query;

    try {
        const newTenant = await prisma.tenant.create({
            data: {
                ...req.body,
                lease: {
                    ...(leaseId ?
                            {connect: {id: parseInt(leaseId)}} :
                            {create: {
                                    ...req.body.lease,
                                    realtor: {
                                        connect: {
                                            userId: req.user.userId
                                        }
                                    }
                                }}
                    )
                }
            },
            include: {
                leases: true
            }
        });

        res.status(200).json({data: newTenant });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating tenant" });
    }
}

export async function getTenants(req, res) {
    try {
        const tenants = await prisma.tenant.findMany({
            where: {
                leases: {
                    some: {
                        realtorId: req.user.userId
                    }
                }
            },
            include: {
                leases: true
            }
        });

        res.status(200).json({data: tenants });
    }
    catch (error) {
        console.log(error)

        res.status(500).json({ message: "Error getting tenants" });
    }
}

export async function getTenant(req, res) {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: {
                id: parseInt(req.params.id),
                leases: {
                    some: {
                        realtorId: req.user.userId
                    }
                }
            },
            include: {
                leases: true
            }
        });

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        res.status(200).json({data: tenant });
    }
    catch (error) {
        res.status(500).json({ message: "Error getting tenant" });
    }
}
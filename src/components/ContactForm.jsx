import { toast } from 'react-toastify';

const ContactForm = () => {

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        formData.append("access_key", "3b7663c6-851a-47b0-9d88-841cf410f21c"); 

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: json
        }).then((res) => res.json());

        if (res.success) {
            toast.success("Form submitted successfully!");
        } else {
            toast.error("Submission failed. Please try again.");
        }
    };

    return (
        <div className="mx-6 px-4 md:mx-auto md:max-w-lg bg-gray-100 rounded-md shadow-md py-6">
            <h1 className="text-3xl text-black font-bold text-center">Contact Us</h1>
            <form onSubmit={onSubmit} className="md:mt-6 mt-8 px-4 md:px-2 space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full rounded-md py-2 sm:py-3 px-3 sm:px-4 text-gray-800 bg-gray-200 focus:bg-transparent text-sm sm:text-base outline-blue-500"
                    required
                    maxLength="50"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full rounded-md py-2 sm:py-3 px-3 sm:px-4 text-gray-800 bg-gray-200 focus:bg-transparent text-sm sm:text-base outline-blue-500"
                    required
                    maxLength="50"
                />
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    className="w-full rounded-md py-2 sm:py-3 px-3 sm:px-4 text-gray-800 bg-gray-200 focus:bg-transparent text-sm sm:text-base outline-blue-500"
                    maxLength="50"
                />
                <textarea
                    name="message"
                    placeholder="Message"
                    rows="6"
                    className="w-full rounded-md px-3 sm:px-4 text-gray-800 bg-gray-200 focus:bg-transparent text-sm sm:text-base pt-2 sm:pt-3 outline-blue-500"
                    required
                    maxLength="100"
                ></textarea>
                <button
                    type="submit"
                    className="text-black font-bold bg-blue-400 hover:bg-blue-600 tracking-wide rounded-md text-sm sm:text-base px-4 py-3 w-full"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ContactForm;

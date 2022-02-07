var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!",
    listings: [],
    loading: true,
    progress: 1,
    process: "",
    error: false,
  },
  async created() {
    await this.getAllListings();
  },
  methods: {
    async getAllListings() {
      this.process = "Loading data...";
      this.progress = 1;
      this.loading = true;
      axios
        .get("https://okazar.com/crondel/")
        .then((resp) => resp.data)
        .then(async (data) => {
          for (var i = 0; i < data.length; i++) {
            this.progress = (i / data.length) * 100 + 1;
            data[i].realtorStatus = await axios
              .get(`http://127.0.0.1:3000/isDeleted?url=${data[i].realtorLink}`)
              .then((resp) => resp.data);
          }
          this.listings = data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.error = true;
        });
    },
    updateListings() {
      this.process = "Updating data...";
      this.loading = true;
      this.progress = 100;
      const toUpdate = this.listings
        .filter((listing) => listing.realtorStatus)
        .map((listing) => {
          return { id: listing.id, sataus: listing.realtorStatus };
        });
      if (toUpdate.length !== 0)
        axios
          .post("https://okazar.com/crondel/", {
            listings: toUpdate,
          })
          .then((resp) => resp.data)
          .then((data) => {
            this.process = "Loading data...";
            this.loading = false;
            if (data.status === 200) this.getAllListings();
          })
          .catch((err) => {
            this.loading = false;
            this.error = true;
          });
      else alert("Everything is up to date. There is nothing to update!");
      this.loading = false;
      this.progress = 100;
    },
  },
});

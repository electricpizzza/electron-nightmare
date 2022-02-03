var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!",
    listings: [],
    loading: true,
    progress: 1,
    promises: [],
  },
  async created() {
    await this.getAllListings();
  },
  methods: {
    async getAllListings() {
      this.progress = 1;
      this.loading = true;
      axios
        .get("https://okazar.com/crondel/test.php")
        .then((resp) => resp.data)
        .then(async (data) => {
          for (var i = 0; i < data.length; i++) {
            this.progress = (i / data.length) * 100 + 1;
            data[i].realtorStatus = await axios
              .get(`http://127.0.0.1:3000/isDeleted?url=${data[i].realtorLink}`)
              .then((resp) => resp.data);
          }
          console.log(this.promises);
          this.listings = data;
          console.log(this.listings);
          this.loading = false;
        })
        .catch(console.error);
    },
    updateListings() {
      this.loading = true;
      this.progress = 100;
      const toUpdate = this.listings
        .filter((listing) => listing.realtorStatus)
        .map((listing) => {
          return { id: listing.id, sataus: listing.realtorStatus };
        });
      console.log(toUpdate);
      if (toUpdate.length !== 0)
        axios
          .post("https://okazar.com/crondel/test.php", {
            listings: toUpdate,
          })
          .then((resp) => resp.data)
          .then((data) => {
            console.log(data);
            this.loading = false;
            if (data.status === 200) this.getAllListings();
          })
          .catch((err) => {
            this.loading = false;
            console.error(err);
          });
      else alert("Everything is up to date. There is nothing to update!");
    },
  },
});

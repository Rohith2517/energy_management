from django.urls import path
from .views import update_data, predict_and_plot_view, get_hourly_rate, predict_consumption

urlpatterns = [
    path('update-data/', update_data, name='update_data'),
    #path('predict-energy/', predict_energy, name='predict_energy'),
    path('predict-solar/', predict_and_plot_view, name='predict_solar'),
    path('predict-consum/', predict_consumption, name='predict_consum'),
    path('api/get-hourly-rate/', get_hourly_rate, name='get-hourly-rate'),
    #path('stream_energy_rates/', stream_energy_rates, name='stream_energy_rates'),
]
